/**
 * Same scenarios as `safeObjectPath` contract tests on the refactored branch, run here against
 * the real `object-path` dependency (pre-#508). Expectations match object-path@0.11.8, not
 * `safeObjectPath` (see PR review discussion).
 */
import objectPath from "object-path";

describe("object-path baseline (pre safeObjectPath)", () => {
    describe("get", () => {
        test("returns nested value by dot path", () => {
            const obj = { structure: { readme: "README.md" } };
            expect(objectPath.get(obj, "structure.readme")).toBe("README.md");
        });

        test("accepts array path", () => {
            const obj = { structure: { readme: "README.md" } };
            expect(objectPath.get(obj, ["structure", "readme"])).toBe("README.md");
        });

        test("returns default when path missing", () => {
            const obj = { a: 1 };
            expect(objectPath.get(obj, "b", "fallback")).toBe("fallback");
            expect(objectPath.get(obj, "a.c", "fallback")).toBe("fallback");
        });

        test("returns default for null / undefined root", () => {
            expect(objectPath.get(null, "a", "d")).toBe("d");
            expect(objectPath.get(undefined, "a", "d")).toBe("d");
        });

        test("empty path returns the object (object-path semantics)", () => {
            expect(objectPath.get({ a: 1 }, "", "d")).toEqual({ a: 1 });
        });

        test("returns null when key exists with null value", () => {
            expect(objectPath.get({ x: null }, "x", "d")).toBeNull();
        });

        test("returns default when traversing into null intermediate", () => {
            expect(objectPath.get({ x: null }, "x.y", "d")).toBe("d");
        });

        test("returns default when traversing into non-object", () => {
            expect(objectPath.get({ x: "str" }, "x.y", "d")).toBe("d");
        });

        test("undefined leaf with default returns default", () => {
            expect(objectPath.get({ a: {} }, "a.missing", "d")).toBe("d");
        });

        test("prototype-ish keys with default", () => {
            const obj = { safe: 1 };
            expect(objectPath.get(obj, "__proto__.polluted", "d")).toBe("d");
            expect(objectPath.get(obj, "constructor.prototype.polluted", "d")).toBe("d");
            expect((obj as { polluted?: unknown }).polluted).toBeUndefined();
        });

        test("does not trim segment whitespace (object-path)", () => {
            expect(objectPath.get({ a: { b: 2 } }, " a . b ", "d")).toBe("d");
        });
    });

    describe("set", () => {
        test("sets nested value by dot path", () => {
            const obj: Record<string, unknown> = {};
            objectPath.set(obj, "structure.readme", "INTRO.md");
            expect(obj).toEqual({ structure: { readme: "INTRO.md" } });
        });

        test("accepts array path", () => {
            const obj: Record<string, unknown> = {};
            objectPath.set(obj, ["structure", "readme"], "INTRO.md");
            expect(obj).toEqual({ structure: { readme: "INTRO.md" } });
        });

        test("overwrites existing nested value", () => {
            const obj: Record<string, unknown> = { structure: { readme: "A.md" } };
            objectPath.set(obj, "structure.readme", "B.md");
            expect((obj.structure as Record<string, unknown>).readme).toBe("B.md");
        });

        test("throws when intermediate is a non-object (object-path)", () => {
            const obj: Record<string, unknown> = { a: "was-string" };
            expect(() => objectPath.set(obj, "a.b", 1)).toThrow();
        });

        test("throws when intermediate is null (object-path / native JS)", () => {
            const obj: Record<string, unknown> = { a: null };
            expect(() => objectPath.set(obj, "a.b", 1)).toThrow();
            expect(obj.a).toBeNull();
        });

        test("uses array index segments like object-path", () => {
            const obj: Record<string, unknown> = {};
            objectPath.set(obj, "items.0.name", "first");
            expect(obj.items).toEqual([{ name: "first" }]);
        });

        test("set on __proto__ path is a no-op for own keys (object-path)", () => {
            const obj: Record<string, unknown> = { ok: true };
            expect(objectPath.set(obj, "__proto__", "ignored")).toBeUndefined();
            expect(obj).toEqual({ ok: true });
        });

        test("set returns undefined (object-path)", () => {
            const obj: Record<string, unknown> = {};
            expect(objectPath.set(obj, "x", 42)).toBeUndefined();
            expect(obj.x).toBe(42);
        });
    });
});
