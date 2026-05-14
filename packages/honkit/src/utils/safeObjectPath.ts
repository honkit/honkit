/**
 * Minimal dot-path get/set with prototype-pollution guards.
 * Replaces object-path for config key access (e.g. "plugins", "structure.readme").
 */

const UNSAFE = new Set(["__proto__", "constructor", "prototype"]);

function segments(path: string): string[] {
    return String(path)
        .split(".")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((s) => !UNSAFE.has(s));
}

export function getAtPath(obj: Record<string, unknown>, path: string, defaultValue?: unknown): unknown {
    if (obj == null || path == null || path === "") {
        return defaultValue;
    }
    const parts = segments(path);
    if (parts.length === 0) {
        return defaultValue;
    }
    let cur: unknown = obj;
    for (const key of parts) {
        if (cur == null || typeof cur !== "object") {
            return defaultValue;
        }
        cur = (cur as Record<string, unknown>)[key];
    }
    return cur === undefined ? defaultValue : cur;
}

export function setAtPath(obj: Record<string, unknown>, path: string, value: unknown): unknown {
    if (obj == null || path == null || path === "") {
        return value;
    }
    const parts = segments(path);
    if (parts.length === 0) {
        return value;
    }
    let cur: Record<string, unknown> = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        let next = cur[key];
        if (next == null || typeof next !== "object") {
            const nextKey = parts[i + 1];
            next = /^\d+$/.test(nextKey) ? [] : {};
            cur[key] = next;
        }
        cur = cur[key] as Record<string, unknown>;
    }
    cur[parts[parts.length - 1]] = value as never;
    return value;
}
