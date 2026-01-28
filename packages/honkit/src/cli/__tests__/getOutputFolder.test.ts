import path from "path";
import getOutputFolder from "../getOutputFolder";

describe("getOutputFolder", () => {
    // Use platform-appropriate absolute paths for testing
    const bookRoot = path.resolve("/book/root");
    const absoluteOutput = path.resolve("/absolute/output");

    describe("relative output path", () => {
        it("should resolve relative to book root", () => {
            const result = getOutputFolder([bookRoot, "./output"]);
            expect(result).toBe(path.join(bookRoot, "output"));
        });

        it("should resolve relative path without ./ prefix", () => {
            const result = getOutputFolder([bookRoot, "dist"]);
            expect(result).toBe(path.join(bookRoot, "dist"));
        });
    });

    describe("absolute output path", () => {
        it("should preserve absolute path as-is", () => {
            const result = getOutputFolder([bookRoot, absoluteOutput]);
            expect(result).toBe(absoluteOutput);
        });
    });

    describe("default output folder", () => {
        it("should use _book in book root when no output specified", () => {
            const result = getOutputFolder([bookRoot]);
            expect(result).toBe(path.join(bookRoot, "_book"));
        });

        it("should use _book in cwd when no args", () => {
            const result = getOutputFolder([]);
            expect(result).toBe(path.join(process.cwd(), "_book"));
        });
    });
});
