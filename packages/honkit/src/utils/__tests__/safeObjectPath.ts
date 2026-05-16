/**
 * Direct unit tests for {@link ../safeObjectPath} — mirrors {@link ./objectPath.contract.test.ts}
 * to keep object-path compatibility. Documents intentional differences (empty path, trimmed
 * segments, unsafe segment handling).
 */
import { getAtPath, setAtPath } from "../safeObjectPath";

describe("safeObjectPath", () => {
    describe("getAtPath", () => {
        test("returns nested value by dot path", () => {
            const obj = { structure: { readme: "README.md" } };
            expect(getAtPath(obj, "structure.readme")).toBe("README.md");
        });

        test("accepts array path", () => {
            const obj = { structure: { readme: "README.md" } };
            expect(getAtPath(obj, ["structure", "readme"])).toBe("README.md");
        });

        test("array path preserves empty-string segments as literal keys", () => {
            const obj = { "": { key: 1 }, a: { "": 2 } };
            expect(getAtPath(obj, ["", "key"], "d")).toBe(1);
            expect(getAtPath(obj, ["a", ""], "d")).toBe(2);
        });

        test("returns default when path missing", () => {
            const obj = { a: 1 };
            expect(getAtPath(obj, "b", "fallback")).toBe("fallback");
            expect(getAtPath(obj, "a.c", "fallback")).toBe("fallback");
        });

        test("returns default for null / undefined root", () => {
            expect(getAtPath(null, "a", "d")).toBe("d");
            expect(getAtPath(undefined, "a", "d")).toBe("d");
        });

        test("empty path returns default (unlike object-path empty-path root)", () => {
            expect(getAtPath({ a: 1 }, "", "d")).toBe("d");
            expect(getAtPath({ a: 1 }, [], "d")).toBe("d");
        });

        test("returns null when key exists with null value", () => {
            expect(getAtPath({ x: null }, "x", "d")).toBeNull();
        });

        test("returns default when traversing into null intermediate", () => {
            expect(getAtPath({ x: null }, "x.y", "d")).toBe("d");
        });

        test("returns default when traversing into non-object", () => {
            expect(getAtPath({ x: "str" }, "x.y", "d")).toBe("d");
        });

        test("undefined leaf with default returns default", () => {
            expect(getAtPath({ a: {} }, "a.missing", "d")).toBe("d");
        });

        test("does not read inherited prototype properties (matches object-path)", () => {
            const obj: Record<string, unknown> = Object.create({ inherited: 1 });
            obj.own = 2;
            expect(getAtPath(obj, "inherited", "d")).toBe("d");
            expect(getAtPath(obj, "own", "d")).toBe(2);
        });

        test("rejects whole path containing unsafe segments", () => {
            const obj: Record<string, unknown> = { safe: 1, polluted: "real-value" };
            expect(getAtPath(obj, "__proto__.polluted", "d")).toBe("d");
            expect(getAtPath(obj, "constructor.prototype.polluted", "d")).toBe("d");
            // path is not rewritten to "polluted" by stripping __proto__
            expect(getAtPath(obj, "__proto__", "d")).toBe("d");
        });

        test("trims segment whitespace for string paths (differs from object-path)", () => {
            expect(getAtPath({ a: { b: 2 } }, " a . b ", "d")).toBe(2);
        });
    });

    describe("setAtPath", () => {
        test("sets nested value by dot path", () => {
            const obj: Record<string, unknown> = {};
            setAtPath(obj, "structure.readme", "INTRO.md");
            expect(obj).toEqual({ structure: { readme: "INTRO.md" } });
        });

        test("accepts array path", () => {
            const obj: Record<string, unknown> = {};
            setAtPath(obj, ["structure", "readme"], "INTRO.md");
            expect(obj).toEqual({ structure: { readme: "INTRO.md" } });
        });

        test("array path preserves empty-string segments when writing", () => {
            const obj: Record<string, unknown> = {};
            setAtPath(obj, ["", "key"], "v");
            expect(obj).toEqual({ "": { key: "v" } });
        });

        test("overwrites existing nested value", () => {
            const obj: Record<string, unknown> = { structure: { readme: "A.md" } };
            setAtPath(obj, "structure.readme", "B.md");
            expect((obj.structure as Record<string, unknown>).readme).toBe("B.md");
        });

        test("uses array index segments for numeric keys", () => {
            const obj: Record<string, unknown> = {};
            setAtPath(obj, "items.0.name", "first");
            expect(obj.items).toEqual([{ name: "first" }]);
        });

        test("throws when intermediate is a non-object scalar (matches object-path)", () => {
            const obj: Record<string, unknown> = { a: "was-string" };
            expect(() => setAtPath(obj, "a.b", 1)).toThrow();
        });

        test("throws when intermediate is null (matches object-path / native JS)", () => {
            const obj: Record<string, unknown> = { a: null };
            expect(() => setAtPath(obj, "a.b", 1)).toThrow();
            // original null is left untouched
            expect(obj.a).toBeNull();
        });

        test("creates missing intermediate when the existing key is undefined", () => {
            const obj: Record<string, unknown> = {};
            setAtPath(obj, "a.b", 1);
            expect(obj).toEqual({ a: { b: 1 } });
        });

        test("set on path containing __proto__ is a no-op (does not write top-level)", () => {
            const obj: Record<string, unknown> = { ok: true };
            expect(setAtPath(obj, "__proto__", "ignored")).toBeUndefined();
            expect(setAtPath(obj, "__proto__.polluted", "ignored")).toBeUndefined();
            expect(obj).toEqual({ ok: true });
            expect((obj as { polluted?: unknown }).polluted).toBeUndefined();
        });

        test("does not descend into inherited objects when setting", () => {
            const proto: Record<string, unknown> = { nested: { shared: 1 } };
            const obj: Record<string, unknown> = Object.create(proto);
            setAtPath(obj, "nested.shared", 2);
            // own "nested" was created on obj, not mutated on proto
            expect(Object.prototype.hasOwnProperty.call(obj, "nested")).toBe(true);
            expect(proto.nested).toEqual({ shared: 1 });
            expect((obj.nested as Record<string, unknown>).shared).toBe(2);
        });

        test("returns undefined (matches object-path)", () => {
            const obj: Record<string, unknown> = {};
            expect(setAtPath(obj, "x", 42)).toBeUndefined();
            expect(obj.x).toBe(42);
        });
    });
});
