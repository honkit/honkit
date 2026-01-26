import { shouldFullRebuild } from "../shouldFullRebuild";

describe("shouldFullRebuild", () => {
    describe("structure files requiring full rebuild", () => {
        it("should return true for SUMMARY.md", () => {
            expect(shouldFullRebuild("/path/to/book/SUMMARY.md")).toBe(true);
        });

        it("should return true for SUMMARY.md (case insensitive)", () => {
            expect(shouldFullRebuild("/path/to/book/summary.md")).toBe(true);
            expect(shouldFullRebuild("/path/to/book/Summary.md")).toBe(true);
        });

        it("should return true for GLOSSARY.md", () => {
            expect(shouldFullRebuild("/path/to/book/GLOSSARY.md")).toBe(true);
        });

        it("should return true for book.json", () => {
            expect(shouldFullRebuild("/path/to/book/book.json")).toBe(true);
        });

        it("should return true for book.js", () => {
            expect(shouldFullRebuild("/path/to/book/book.js")).toBe(true);
        });
    });

    describe("content files allowing incremental build", () => {
        it("should return false for regular markdown files", () => {
            expect(shouldFullRebuild("/path/to/book/README.md")).toBe(false);
            expect(shouldFullRebuild("/path/to/book/chapter1.md")).toBe(false);
            expect(shouldFullRebuild("/path/to/book/docs/page.md")).toBe(false);
        });

        it("should return false for files with SUMMARY in path but different name", () => {
            expect(shouldFullRebuild("/path/to/SUMMARY/page.md")).toBe(false);
        });
    });
});
