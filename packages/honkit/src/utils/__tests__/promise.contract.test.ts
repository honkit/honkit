/**
 * Contract tests for {@link ../promise} — encodes the Q-style API from `q` before the native
 * shim (see PR review: https://github.com/honkit/honkit/pull/508#pullrequestreview-4268311613).
 */
import Immutable from "immutable";
import PromiseUtil from "../promise";

describe("promise contract (Q implementation)", () => {
    test("factory resolves value", async () => {
        await expect(PromiseUtil(7)).resolves.toBe(7);
    });

    test("thenResolve replaces result", async () => {
        const p = PromiseUtil("a").thenResolve("b");
        await expect(p).resolves.toBe("b");
    });

    test("spread unpacks array fulfillment", async () => {
        const p = PromiseUtil([1, 2, 3]).spread((a: number, b: number, c: number) => a + b + c);
        await expect(p).resolves.toBe(6);
    });

    test.skip("spread with non-array fulfillment (Q never settles)", async () => {
        const p = PromiseUtil("solo").spread((x: string) => x + "!");
        await expect(p).resolves.toBe("solo!");
    });

    test("fail is catch alias", async () => {
        const p = PromiseUtil.reject(new Error("x")).fail(() => "recovered");
        await expect(p).resolves.toBe("recovered");
    });

    test("tap runs side effect and preserves value", async () => {
        let tapped: number | undefined;
        const p = PromiseUtil(5).tap((v) => {
            tapped = v;
        });
        await expect(p).resolves.toBe(5);
        expect(tapped).toBe(5);
    });

    test("tap awaits async side effect", async () => {
        const order: string[] = [];
        const p = PromiseUtil("x").tap(async () => {
            order.push("tap");
        });
        await p;
        order.push("after");
        expect(order).toEqual(["tap", "after"]);
    });

    test("fin runs on success and preserves value", async () => {
        let ran = false;
        const p = PromiseUtil(9).fin(() => {
            ran = true;
        });
        await expect(p).resolves.toBe(9);
        expect(ran).toBe(true);
    });

    test("fin runs on failure and preserves rejection", async () => {
        let ran = false;
        const err = new Error("boom");
        const p = PromiseUtil.reject(err).fin(() => {
            ran = true;
        });
        await expect(p).rejects.toThrow("boom");
        expect(ran).toBe(true);
    });

    test("defer resolve / reject", async () => {
        const d = PromiseUtil.defer();
        d.resolve(123);
        await expect(d.promise).resolves.toBe(123);

        const d2 = PromiseUtil.defer();
        d2.reject(new Error("no"));
        await expect(d2.promise).rejects.toThrow("no");
    });

    test("defer makeNodeResolver (single result)", async () => {
        const d = PromiseUtil.defer();
        d.makeNodeResolver()(null, "ok");
        await expect(d.promise).resolves.toBe("ok");
    });

    test("defer makeNodeResolver (multiple results become array)", async () => {
        const d = PromiseUtil.defer();
        d.makeNodeResolver()(null, "a", "b");
        await expect(d.promise).resolves.toEqual(["a", "b"]);
    });

    test("defer notify invokes progress handlers", async () => {
        const d = PromiseUtil.defer();
        const seen: unknown[] = [];
        d.promise.progress((x) => seen.push(x));
        d.notify("chunk");
        d.resolve("done");
        await d.promise;
        expect(seen).toEqual(["chunk"]);
    });

    test("nfcall and get(index)", async () => {
        function read(cb: (err: Error | null, a: string, b: string) => void) {
            cb(null, "x", "y");
        }
        const p = PromiseUtil.nfcall(read).get(1);
        await expect(p).resolves.toBe("y");
    });

    test("nfbind binds this", async () => {
        const ctx = {
            val: 3,
            run(cb: (err: Error | null, n: number) => void) {
                cb(null, this.val);
            }
        };
        const bound = PromiseUtil.nfbind(ctx.run.bind(ctx));
        await expect(bound()).resolves.toBe(3);
    });

    test("reduce over array", async () => {
        const p = PromiseUtil.reduce([1, 2, 3], (acc, n) => acc + n, 0);
        await expect(p).resolves.toBe(6);
    });

    test("reduce over Immutable.List", async () => {
        const p = PromiseUtil.reduce(Immutable.List([2, 3]), (acc, n) => acc * n, 2);
        await expect(p).resolves.toBe(12);
    });

    test("forEach", async () => {
        const acc: number[] = [];
        await PromiseUtil.forEach([10, 20], (n) => {
            acc.push(n);
        });
        expect(acc).toEqual([10, 20]);
    });

    test("serie collects mapped results in order", async () => {
        const p = PromiseUtil.serie(["a", "b"], (s) => s.toUpperCase());
        await expect(p).resolves.toEqual(["A", "B"]);
    });

    test("some returns first truthy iter result", async () => {
        const p = PromiseUtil.some([0, "", 42, 99], (x) => x);
        await expect(p).resolves.toBe(42);
    });

    test("some yields last iter result when no value is truthy", async () => {
        const p = PromiseUtil.some([0, "", null], (x) => x);
        await expect(p).resolves.toBeNull();
    });

    test("map over array returns Immutable.List", async () => {
        const p = PromiseUtil.map([1, 2], (n) => n * 2);
        const list = await p;
        expect(Immutable.List.isList(list)).toBe(true);
        expect((list as Immutable.List<number>).toJS()).toEqual([2, 4]);
    });

    test("map over Immutable.Map preserves Map", async () => {
        const m = Immutable.Map({ a: 1, b: 2 });
        const p = PromiseUtil.map(m, (v) => v + 10);
        const out = await p;
        expect(Immutable.Map.isMap(out)).toBe(true);
        expect((out as Immutable.Map<string, number>).toJS()).toEqual({ a: 11, b: 12 });
    });

    test("map over Immutable.OrderedMap preserves OrderedMap", async () => {
        const m = Immutable.OrderedMap({ z: 1, a: 2 });
        const p = PromiseUtil.map(m, (v) => v + 10);
        const out = await p;
        expect(Immutable.OrderedMap.isOrderedMap(out)).toBe(true);
        expect((out as Immutable.OrderedMap<string, number>).toJS()).toEqual({ z: 11, a: 12 });
    });

    test("wrap defers sync function", async () => {
        const fn = PromiseUtil.wrap((a: number, b: number) => a + b);
        await expect(fn(2, 3)).resolves.toBe(5);
    });

    test("reject", async () => {
        await expect(PromiseUtil.reject(new Error("r"))).rejects.toThrow("r");
    });

    test("all", async () => {
        await expect(PromiseUtil.all([1, Promise.resolve(2)])).resolves.toEqual([1, 2]);
    });

    test("isPromiseAlike", () => {
        expect(PromiseUtil.isPromiseAlike(null)).toBe(false);
        expect(PromiseUtil.isPromiseAlike({})).toBe(false);
        expect(PromiseUtil.isPromiseAlike(Promise.resolve())).toBe(true);
        expect(PromiseUtil.isPromiseAlike({ then() {} })).toBe(true);
    });

    test("nodeify with callback", async () => {
        await new Promise<void>((resolve, reject) => {
            PromiseUtil(88).nodeify((err, val) => {
                if (err) reject(err);
                else {
                    expect(val).toBe(88);
                    resolve();
                }
            });
        });
    });

    test("nodeify without callback returns promise", async () => {
        const p = PromiseUtil(1).nodeify();
        await expect(p).resolves.toBe(1);
    });

    test("top-level progress is no-op chain passthrough", async () => {
        const p = PromiseUtil(5).progress(() => {
            /* unused for non-deferred promises */
        });
        await expect(p).resolves.toBe(5);
    });
});
