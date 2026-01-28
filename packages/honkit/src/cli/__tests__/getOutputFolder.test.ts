import path from "path";
import getOutputFolder from "../getOutputFolder";

describe("getOutputFolder", () => {
    describe("relative output path", () => {
        it("should resolve relative to book root", () => {
            const result = getOutputFolder(["/book/root", "./output"]);
            expect(result).toBe(path.join("/book/root", "output"));
        });

        it("should resolve relative path without ./ prefix", () => {
            const result = getOutputFolder(["/book/root", "dist"]);
            expect(result).toBe(path.join("/book/root", "dist"));
        });
    });

    describe("absolute output path", () => {
        it("should preserve absolute path as-is", () => {
            const result = getOutputFolder(["/book/root", "/absolute/output"]);
            expect(result).toBe("/absolute/output");
        });
    });

    describe("default output folder", () => {
        it("should use _book in book root when no output specified", () => {
            const result = getOutputFolder(["/book/root"]);
            expect(result).toBe(path.join("/book/root", "_book"));
        });

        it("should use _book in cwd when no args", () => {
            const result = getOutputFolder([]);
            expect(result).toBe(path.join(process.cwd(), "_book"));
        });
    });
});
