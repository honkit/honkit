import { shouldFullRebuild, isStructureFile } from "../shouldFullRebuild";

describe("shouldFullRebuild", () => {
    describe("structure files (change event)", () => {
        it("should return true for SUMMARY.md change", () => {
            expect(shouldFullRebuild("/path/to/book/SUMMARY.md", "change")).toBe(true);
        });

        it("should return true for SUMMARY.md (case insensitive)", () => {
            expect(shouldFullRebuild("/path/to/book/summary.md", "change")).toBe(true);
            expect(shouldFullRebuild("/path/to/book/Summary.md", "change")).toBe(true);
        });

        it("should return true for GLOSSARY.md change", () => {
            expect(shouldFullRebuild("/path/to/book/GLOSSARY.md", "change")).toBe(true);
        });

        it("should return true for book.json change", () => {
            expect(shouldFullRebuild("/path/to/book/book.json", "change")).toBe(true);
        });

        it("should return true for book.js change", () => {
            expect(shouldFullRebuild("/path/to/book/book.js", "change")).toBe(true);
        });
    });

    describe("new file additions (add event)", () => {
        it("should return true for any new file", () => {
            expect(shouldFullRebuild("/path/to/book/newfile.md", "add")).toBe(true);
            expect(shouldFullRebuild("/path/to/book/image.png", "add")).toBe(true);
        });

        it("should return true for new structure files", () => {
            expect(shouldFullRebuild("/path/to/book/SUMMARY.md", "add")).toBe(true);
        });
    });

    describe("file deletions (unlink event)", () => {
        it("should return true for any deleted file", () => {
            expect(shouldFullRebuild("/path/to/book/deleted.md", "unlink")).toBe(true);
            expect(shouldFullRebuild("/path/to/book/image.png", "unlink")).toBe(true);
        });

        it("should return true for deleted structure files", () => {
            expect(shouldFullRebuild("/path/to/book/SUMMARY.md", "unlink")).toBe(true);
        });
    });

    describe("content files (change event)", () => {
        it("should return false for regular markdown file changes", () => {
            expect(shouldFullRebuild("/path/to/book/README.md", "change")).toBe(false);
            expect(shouldFullRebuild("/path/to/book/chapter1.md", "change")).toBe(false);
            expect(shouldFullRebuild("/path/to/book/docs/page.md", "change")).toBe(false);
        });

        it("should return false for files with SUMMARY in path but different name", () => {
            expect(shouldFullRebuild("/path/to/SUMMARY/page.md", "change")).toBe(false);
        });
    });

    describe("without eventType (backwards compatibility)", () => {
        it("should return true for structure files", () => {
            expect(shouldFullRebuild("/path/to/book/SUMMARY.md")).toBe(true);
        });

        it("should return false for regular files", () => {
            expect(shouldFullRebuild("/path/to/book/README.md")).toBe(false);
        });
    });
});

describe("isStructureFile", () => {
    it("should identify SUMMARY.md as structure file", () => {
        expect(isStructureFile("/path/to/SUMMARY.md")).toBe(true);
        expect(isStructureFile("/path/to/summary.md")).toBe(true);
    });

    it("should identify GLOSSARY.md as structure file", () => {
        expect(isStructureFile("/path/to/GLOSSARY.md")).toBe(true);
    });

    it("should identify book.json as structure file", () => {
        expect(isStructureFile("/path/to/book.json")).toBe(true);
    });

    it("should identify book.js as structure file", () => {
        expect(isStructureFile("/path/to/book.js")).toBe(true);
    });

    it("should NOT identify regular files as structure files", () => {
        expect(isStructureFile("/path/to/README.md")).toBe(false);
        expect(isStructureFile("/path/to/chapter.md")).toBe(false);
    });
});
