import Immutable from "immutable";

/** HonKit historically used `q`; this module keeps the same surface on top of native Promises. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtendedPromise<T> = Promise<T> & {
    thenResolve<U>(value: U): ExtendedPromise<U>;
    spread(fn: (...args: any[]) => any): ExtendedPromise<any>;
    fail(onRejected: (reason: unknown) => unknown): ExtendedPromise<unknown>;
    get?(index: number): ExtendedPromise<unknown>;
    tap(onFulfilled: (value: T) => unknown): ExtendedPromise<T>;
    progress(onProgress: (data: unknown) => void): ExtendedPromise<T>;
    nodeify(callback?: (err: unknown, result?: T) => void): ExtendedPromise<T> | void;
    /** Q `fin` — like `finally`; preserves fulfillment value or rejection reason. */
    fin(onFinally: () => unknown): ExtendedPromise<T>;
};

const HONKIT = Symbol("honkitPromise");

function extendPromise<T>(p: Promise<T>): ExtendedPromise<T> {
    const ep = p as ExtendedPromise<T>;
    if ((ep as unknown as { [HONKIT]?: boolean })[HONKIT]) {
        return ep;
    }
    (ep as unknown as { [HONKIT]: boolean })[HONKIT] = true;

    const origThen = p.then.bind(p);
    const origCatch = p.catch.bind(p);

    ep.then = function (onFulfilled, onRejected) {
        return extendPromise(origThen(onFulfilled, onRejected));
    } as typeof ep.then;

    ep.catch = function (onRejected) {
        return extendPromise(origCatch(onRejected));
    } as typeof ep.catch;

    ep.thenResolve = function <U>(this: Promise<T>, value: U) {
        return extendPromise(this.then(() => value));
    };

    ep.spread = function (this: Promise<T>, fn: (...args: any[]) => unknown) {
        return extendPromise(
            this.then((arr: unknown) => {
                if (Array.isArray(arr)) {
                    return fn(...arr);
                }
                return fn(arr);
            })
        );
    };

    ep.fail = function (this: Promise<T>, onRejected: (reason: unknown) => unknown) {
        return extendPromise(this.catch(onRejected));
    };

    ep.tap = function (this: Promise<T>, onFulfilled: (value: T) => unknown) {
        return extendPromise(this.then((value: T) => Promise.resolve(onFulfilled(value)).then(() => value)));
    };

    ep.progress = function (this: Promise<T>, _onProgress: (data: unknown) => void) {
        return ep;
    };

    ep.nodeify = function (this: Promise<T>, callback?: (err: unknown, result?: T) => void) {
        if (!callback) {
            return ep;
        }
        this.then(
            (result) => {
                callback(null, result);
            },
            (err) => {
                callback(err);
            }
        );
        return undefined;
    };

    ep.fin = function (this: Promise<T>, onFinally: () => unknown) {
        return extendPromise(
            (this as Promise<T>).finally(() => {
                return onFinally();
            })
        );
    };

    return ep;
}

function defer() {
    const progressHandlers = new Set<(data: unknown) => void>();
    let resolve!: (value?: unknown) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<unknown>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    const ext = extendPromise(promise);
    (ext as ExtendedPromise<unknown>).progress = function (_onProgress: (data: unknown) => void) {
        progressHandlers.add(_onProgress);
        return ext;
    };
    return {
        promise: ext,
        resolve,
        reject,
        notify(data: unknown) {
            progressHandlers.forEach((f) => f(data));
        },
        makeNodeResolver() {
            return (err: unknown, ...args: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(args.length <= 1 ? args[0] : args);
                }
            };
        }
    };
}

function nfcall(
    fn: (...args: unknown[]) => unknown,
    ...args: unknown[]
): ExtendedPromise<unknown> & {
    get(index: number): ExtendedPromise<unknown>;
} {
    const inner = new Promise<unknown>((resolve, reject) => {
        const callback = (err: unknown, ...cbArgs: unknown[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(cbArgs.length <= 1 ? cbArgs[0] : cbArgs);
            }
        };
        (fn as (...a: unknown[]) => void)(...args, callback);
    });
    const ext = extendPromise(inner) as ExtendedPromise<unknown> & { get(index: number): ExtendedPromise<unknown> };
    ext.get = (index: number) =>
        extendPromise(
            inner.then((val: unknown) => {
                if (Array.isArray(val)) {
                    return val[index];
                }
                return index === 0 ? val : undefined;
            })
        );
    return ext;
}

function nfbind(fn: (...args: unknown[]) => unknown) {
    return function (this: unknown, ...args: unknown[]) {
        return nfcall(fn.bind(this), ...args);
    };
}

function reduce<TAcc, TElem>(
    arr: Immutable.List<TElem> | unknown[] | Immutable.Iterable<TElem, unknown>,
    iter: (acc: TAcc, elem: TElem, key: unknown) => unknown,
    base?: TAcc
): ExtendedPromise<TAcc> {
    const list = Immutable.Iterable.isIterable(arr) ? arr : Immutable.List(arr as unknown[]);

    return list.reduce(
        (prev: ExtendedPromise<TAcc>, elem: TElem, key: unknown) => {
            return prev.then((val) => iter(val as TAcc, elem, key)) as ExtendedPromise<TAcc>;
        },
        extendPromise(Promise.resolve(base) as Promise<TAcc>)
    ) as ExtendedPromise<TAcc>;
}

function forEach<T>(
    arr: Immutable.List<T> | unknown[] | Immutable.Iterable<T, unknown>,
    iter: (el: T, key: unknown) => unknown
) {
    return reduce(
        arr,
        (_val: undefined, el: T, key: unknown) => {
            return iter(el, key);
        },
        undefined
    );
}

function serie<T, R>(
    arr: Immutable.List<T> | unknown[] | Immutable.Iterable<T, unknown>,
    iter: (item: T, key: unknown) => unknown
) {
    return reduce(
        arr,
        (before: R[], item: T, key: unknown) => {
            return extendPromise(Promise.resolve(iter(item, key)) as Promise<R>).then((r: R) => {
                before.push(r);
                return before;
            });
        },
        [] as R[]
    );
}

function some<T>(
    arr: Immutable.List<T> | unknown[] | Immutable.Iterable<T, unknown>,
    iter: (el: T, i: unknown) => unknown
) {
    const list = Immutable.List.isList(arr) ? (arr as Immutable.List<T>) : Immutable.List(arr as T[]);

    return list.reduce(
        (prev: ExtendedPromise<unknown>, elem: T, i: number) => {
            return prev.then((val) => {
                if (val) {
                    return val;
                }
                return iter(elem, i);
            });
        },
        extendPromise(Promise.resolve(undefined))
    );
}

function mapAsList<T, R>(
    arr: Immutable.List<T> | unknown[] | Immutable.Iterable<T, unknown>,
    iter: (entry: T, i: unknown) => unknown
) {
    return reduce(
        arr,
        (prev: R[], entry: T, i: unknown) => {
            return extendPromise(Promise.resolve(iter(entry, i)) as Promise<R>).then((out: R) => {
                prev.push(out);
                return prev;
            });
        },
        [] as R[]
    );
}

function map<T, R>(
    arr:
        | Immutable.Map<string, T>
        | Immutable.OrderedMap<string, T>
        | Immutable.List<T>
        | unknown[]
        | Immutable.Iterable<T, unknown>,
    iter: (el: T, key: unknown) => unknown
) {
    if (Immutable.Map.isMap(arr)) {
        let type = "Map";
        if (Immutable.OrderedMap.isOrderedMap(arr)) {
            type = "OrderedMap";
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return mapAsList(
            arr as any,
            ((value: T, key: unknown) => {
                return extendPromise(Promise.resolve(iter(value, key)) as Promise<R>).then((result: R) => {
                    return [key, result];
                });
            }) as any
        ).then((result: [unknown, R][]) => {
            return Immutable[type as "Map"](result);
        });
    } else {
        return mapAsList(arr as Immutable.List<T>, iter).then((result: R[]) => {
            return Immutable.List(result);
        });
    }
}

function wrap(func: (...args: unknown[]) => unknown) {
    return function (this: unknown, ...args: unknown[]) {
        return extendPromise(Promise.resolve()).then(() => {
            return func.apply(this, args);
        });
    };
}

function isPromiseAlike(x: unknown): boolean {
    return x != null && typeof (x as { then?: unknown }).then === "function";
}

/* eslint-disable @typescript-eslint/no-explicit-any -- Q-compatible surface is intentionally loose for chaining */
const HonkitPromiseRoot = Object.assign(
    function HonkitPromise(value?: any): any {
        return extendPromise(Promise.resolve(value));
    },
    {
        defer,
        nfcall,
        nfbind,
        reject: (reason?: unknown) => extendPromise(Promise.reject(reason)),
        all: (values: any) => extendPromise(Promise.all(Array.from(values))),
        reduce,
        forEach,
        map,
        serie,
        some,
        wrap,
        isPromiseAlike
    }
);

export default HonkitPromiseRoot as any;
export { forEach, reduce, map, serie, some, wrap };
