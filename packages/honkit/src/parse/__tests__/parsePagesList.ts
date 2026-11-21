import createMockFS from "../../fs/mock";
import Book from "../../models/book";
import parseBook from "../parseBook";
import parsePagesList from "../parsePagesList";

describe("parsePagesList", () => {
    // https://github.com/honkit/honkit/issues/453
    test("should not list a file without a parser, like a PDF, as a page", () => {
        const fs = createMockFS({
            "SUMMARY.md": `# Summary

* [Introduction](README.md)
* [Download PDF](download/book.pdf)
`,
            "README.md": "# Introduction",
            download: {
                "book.pdf": "%PDF-1.4"
            }
        });
        const book = Book.createForFS(fs);

        return parseBook(book)
            .then((resultBook) => parsePagesList(resultBook))
            .then((pages) => {
                expect(pages.has("README.md")).toBe(true);
                expect(pages.has("download/book.pdf")).toBe(false);
            });
    });
});
