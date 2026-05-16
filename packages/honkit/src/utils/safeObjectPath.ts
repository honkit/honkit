/**
 * Minimal dot-path get/set with prototype-pollution guards.
 * Replaces object-path for config key access (e.g. "plugins", "structure.readme").
 *
 * Behavior is kept compatible with the previous object-path wrapper:
 *  - get / set accept `string | string[]`
 *  - set throws when an intermediate value is a non-object scalar
 *  - set returns undefined
 *  - paths containing __proto__ / constructor / prototype are rejected as a whole
 *  - lookups only descend through own enumerable properties
 */

const UNSAFE = new Set(["__proto__", "constructor", "prototype"]);

function toSegments(path: string | string[]): string[] | null {
    const raw = Array.isArray(path)
        ? path.map((s) => String(s))
        : String(path)
              .split(".")
              .map((s) => s.trim());
    const parts = raw.filter((s) => s.length > 0);
    if (parts.length === 0) {
        return null;
    }
    for (const part of parts) {
        if (UNSAFE.has(part)) {
            return null;
        }
    }
    return parts;
}

function hasOwnEnumerable(obj: object, key: string): boolean {
    return Object.prototype.propertyIsEnumerable.call(obj, key);
}

export function getAtPath(
    obj: Record<string, unknown> | null | undefined,
    path: string | string[],
    defaultValue?: unknown
): unknown {
    if (obj == null || path == null) {
        return defaultValue;
    }
    const parts = toSegments(path);
    if (parts === null) {
        return defaultValue;
    }
    let cur: unknown = obj;
    for (const key of parts) {
        if (cur == null || typeof cur !== "object") {
            return defaultValue;
        }
        if (!hasOwnEnumerable(cur as object, key)) {
            return defaultValue;
        }
        cur = (cur as Record<string, unknown>)[key];
    }
    return cur === undefined ? defaultValue : cur;
}

export function setAtPath(
    obj: Record<string, unknown> | null | undefined,
    path: string | string[],
    value: unknown
): void {
    if (obj == null || path == null) {
        return;
    }
    const parts = toSegments(path);
    if (parts === null) {
        return;
    }
    let cur: Record<string, unknown> = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        const ownNext = hasOwnEnumerable(cur, key) ? cur[key] : undefined;
        if (ownNext === undefined || ownNext === null) {
            const nextKey = parts[i + 1];
            const created: Record<string, unknown> | unknown[] = /^\d+$/.test(nextKey) ? [] : {};
            cur[key] = created;
            cur = created as Record<string, unknown>;
            continue;
        }
        if (typeof ownNext !== "object") {
            throw new Error(
                `safeObjectPath.setAtPath: cannot set "${parts.join(".")}" because intermediate "${parts
                    .slice(0, i + 1)
                    .join(".")}" is not an object`
            );
        }
        cur = ownNext as Record<string, unknown>;
    }
    cur[parts[parts.length - 1]] = value;
}
