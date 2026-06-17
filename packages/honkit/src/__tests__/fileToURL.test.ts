import createMockOutput from "../output/testing/createMock";
import WebsiteGenerator from "../output/website";
import fileToURL from "../output/helper/fileToURL";

jest.setTimeout(60000);

describe("fileToURL", () => {
    describe("default mode (prettyUrls off, directoryIndex on)", () => {
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

        it("should convert README.md to ./", () => {
            expect(fileToURL(output, "README.md")).toBe("./");
        });

        it("should convert regular page to page.html", () => {
            expect(fileToURL(output, "page.md")).toBe("page.html");
        });

        it("should convert nested README to subdir/", () => {
            expect(fileToURL(output, "subdir/README.md")).toBe("subdir/");
        });

        it("should convert nested page to subdir/page.html", () => {
            expect(fileToURL(output, "subdir/page.md")).toBe("subdir/page.html");
        });
    });

    describe("prettyUrls mode (directoryIndex on)", () => {
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

        it("should convert README.md to ./ (unchanged)", () => {
            expect(fileToURL(output, "README.md")).toBe("./");
        });

        it("should strip .html from regular page URL", () => {
            expect(fileToURL(output, "page.md")).toBe("page");
        });

        it("should strip .html from nested page URL", () => {
            expect(fileToURL(output, "subdir/page.md")).toBe("subdir/page");
        });

        it("should keep nested README as subdir/ (unchanged)", () => {
            expect(fileToURL(output, "subdir/README.md")).toBe("subdir/");
        });
    });
});
