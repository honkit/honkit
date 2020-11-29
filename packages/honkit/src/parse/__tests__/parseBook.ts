import Book from "../../models/book";
import createMockFS from "../../fs/mock";
import parseBook from "../parseBook";

describe("parseBook", () => {
    test("should parse multilingual book", () => {
        const fs = createMockFS({
            "LANGS.md": "# Languages\n\n* [en](en)\n* [fr](fr)",
            en: {
                "README.md": "Hello",
            },
            fr: {
                "README.md": "Bonjour",
            },
        });
        const book = Book.createForFS(fs);

        return parseBook(book).then((resultBook) => {
            const languages = resultBook.getLanguages();
            const books = resultBook.getBooks();

            expect(resultBook.isMultilingual()).toBe(true);
            expect(languages.getList().size).toBe(2);
            expect(books.size).toBe(2);
        });
    });

    test("should extend configuration for multilingual book", () => {
        const fs = createMockFS({
            "LANGS.md": "# Languages\n\n* [en](en)\n* [fr](fr)",
            "book.json": '{ "title": "Test", "author": "HonKit" }',
            en: {
                "README.md": "Hello",
                "book.json": '{ "title": "Test EN" }',
            },
            fr: {
                "README.md": "Bonjour",
            },
        });
        const book = Book.createForFS(fs);

        return parseBook(book).then((resultBook) => {
            const books = resultBook.getBooks();

            expect(resultBook.isMultilingual()).toBe(true);
            expect(books.size).toBe(2);

            const en = books.get("en");
            const fr = books.get("fr");

            const enConfig = en.getConfig();
            const frConfig = fr.getConfig();

            expect(enConfig.getValue("title")).toBe("Test EN");
            expect(enConfig.getValue("author")).toBe("HonKit");

            expect(frConfig.getValue("title")).toBe("Test");
            expect(frConfig.getValue("author")).toBe("HonKit");
        });
    });

    test("should parse book in a directory", () => {
        const fs = createMockFS({
            "book.json": JSON.stringify({
                root: "./test",
            }),
            test: {
                "README.md": "Hello World",
                "SUMMARY.md": "# Summary\n\n* [Page](page.md)\n",
                "page.md": "Page",
            },
        });
        const book = Book.createForFS(fs);

        return parseBook(book).then((resultBook) => {
            const readme = resultBook.getReadme();
            const summary = resultBook.getSummary();
            const articles = summary.getArticlesAsList();

            expect(summary.getFile().exists()).toBe(true);
            expect(readme.getFile().exists()).toBe(true);
            expect(articles.size).toBe(2);
        });
    });
});
