/**
 * Minimal dot-path get/set with prototype-pollution guards.
 * Replaces object-path for config key access (e.g. "plugins", "structure.readme").
 *
 * Behavior is kept compatible with the previous object-path wrapper:
 *  - get / set accept `string | string[]`
 *  - lookups only descend through own properties (matches object-path)
 *  - set throws when an intermediate value is a non-object scalar (string,
 *    number, boolean, null) — null follows from native JS, the others match
 *    object-path's check
 *  - set returns undefined
 *  - paths containing __proto__ / constructor / prototype are rejected as a
 *    whole, so e.g. "__proto__.polluted" does not collapse to "polluted"
 */

const UNSAFE = new Set(["__proto__", "constructor", "prototype"]);

function toSegments(path: string | string[]): string[] | null {
    let parts: string[];
    if (Array.isArray(path)) {
        // Array paths are caller-supplied keys — empty string is a valid property name
        parts = path.map((s) => String(s));
    } else {
        // String paths are dot-delimited; trim whitespace and drop empty split artifacts
        parts = String(path)
            .split(".")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    }
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

function hasOwn(obj: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
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
        if (!hasOwn(cur as object, key)) {
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
        if (!hasOwn(cur, key) || cur[key] === undefined) {
            const nextKey = parts[i + 1];
            const created: Record<string, unknown> | unknown[] = /^\d+$/.test(nextKey) ? [] : {};
            cur[key] = created;
            cur = created as Record<string, unknown>;
            continue;
        }
        const ownNext = cur[key];
        if (ownNext === null || typeof ownNext !== "object") {
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
