/**
 * Direct unit tests for {@link ../safeObjectPath} — scenarios aligned with
 * {@link ./objectPath.contract.test.ts} where semantics match; otherwise documents
 * intentional differences (empty path, trimmed segments, set on unsafe keys).
 */
import { getAtPath, setAtPath } from "../safeObjectPath";

describe("safeObjectPath", () => {
    describe("getAtPath", () => {
        test("returns nested value by dot path", () => {
            const obj = { structure: { readme: "README.md" } };
            expect(getAtPath(obj, "structure.readme")).toBe("README.md");
        });

        test("returns default when path missing", () => {
            const obj = { a: 1 };
            expect(getAtPath(obj, "b", "fallback")).toBe("fallback");
            expect(getAtPath(obj, "a.c", "fallback")).toBe("fallback");
        });

        test("returns default for null / undefined root", () => {
            expect(getAtPath(null as unknown as Record<string, unknown>, "a", "d")).toBe("d");
            expect(getAtPath(undefined as unknown as Record<string, unknown>, "a", "d")).toBe("d");
        });

        test("empty path returns default (unlike object-path empty-path root)", () => {
            expect(getAtPath({ a: 1 }, "", "d")).toBe("d");
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

        test("unsafe path segments are ignored (prototype pollution guard)", () => {
            const obj: Record<string, unknown> = { safe: 1 };
            expect(getAtPath(obj, "__proto__.polluted", "d")).toBe("d");
            expect(getAtPath(obj, "constructor.prototype.polluted", "d")).toBe("d");
            expect((obj as { polluted?: unknown }).polluted).toBeUndefined();
        });

        test("trims segment whitespace (differs from object-path)", () => {
            expect(getAtPath({ a: { b: 2 } }, " a . b ", "d")).toBe(2);
        });
    });

    describe("setAtPath", () => {
        test("sets nested value by dot path", () => {
            const obj: Record<string, unknown> = {};
            setAtPath(obj, "structure.readme", "INTRO.md");
            expect(obj).toEqual({ structure: { readme: "INTRO.md" } });
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

        test("set on __proto__ path does not mutate object (segments filtered)", () => {
            const obj: Record<string, unknown> = { ok: true };
            expect(setAtPath(obj, "__proto__", "ignored")).toBe("ignored");
            expect(obj).toEqual({ ok: true });
        });

        test("returns the assigned value", () => {
            const obj: Record<string, unknown> = {};
            expect(setAtPath(obj, "x", 42)).toBe(42);
            expect(obj.x).toBe(42);
        });

        test("replaces string intermediate with object when deepening path", () => {
            const obj: Record<string, unknown> = { a: "was-string" };
            setAtPath(obj, "a.b", 1);
            expect(obj.a).toEqual({ b: 1 });
        });
    });
});
