import createMockOutput from "../output/testing/createMock";
import WebsiteGenerator from "../output/website";
import fileToOutput from "../output/helper/fileToOutput";

jest.setTimeout(60000);

describe("fileToOutput", () => {
    describe("default mode", () => {
        let output;

        beforeAll(async () => {
            output = await createMockOutput(
                WebsiteGenerator,
                {
                    "README.md": "Hello World",
                    "SUMMARY.md": "# Summary\n\n* [Page](page.md)\n* [Deep](subdir/page.md)",
                    "page.md": "Page content",
                    subdir: {
                        "page.md": "Nested content",
                        "README.md": "Subdir readme"
                    }
                },
                undefined
            );
        });

        it("should convert README.md to index.html", () => {
            expect(fileToOutput(output, "README.md")).toBe("index.html");
        });

        it("should convert regular page to page.html", () => {
            expect(fileToOutput(output, "page.md")).toBe("page.html");
        });

        it("should convert nested page to subdir/page.html", () => {
            expect(fileToOutput(output, "subdir/page.md")).toBe("subdir/page.html");
        });

        it("should convert nested README to subdir/index.html", () => {
            expect(fileToOutput(output, "subdir/README.md")).toBe("subdir/index.html");
        });
    });

    describe("prettyUrls mode", () => {
        let output;

        beforeAll(async () => {
            output = await createMockOutput(
                WebsiteGenerator,
                {
                    "README.md": "Hello World",
                    "SUMMARY.md": "# Summary\n\n* [Page](page.md)\n* [Deep](subdir/page.md)",
                    "book.json": '{ "prettyUrls": true }',
                    "page.md": "Page content",
                    subdir: {
                        "page.md": "Nested content",
                        "README.md": "Subdir readme"
                    }
                },
                undefined
            );
        });

        it("should still produce page.html (output unchanged)", () => {
            expect(fileToOutput(output, "page.md")).toBe("page.html");
        });

        it("should still produce subdir/page.html (output unchanged)", () => {
            expect(fileToOutput(output, "subdir/page.md")).toBe("subdir/page.html");
        });

        it("should keep README.md as index.html", () => {
            expect(fileToOutput(output, "README.md")).toBe("index.html");
        });

        it("should keep nested README as subdir/index.html", () => {
            expect(fileToOutput(output, "subdir/README.md")).toBe("subdir/index.html");
        });
    });
});
