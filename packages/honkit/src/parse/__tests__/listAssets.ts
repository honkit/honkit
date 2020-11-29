import Immutable from "immutable";
import createMockFS from "../../fs/mock";
import Book from "../../models/book";
import listAssets from "../listAssets";
import parseGlossary from "../parseGlossary";
import parseBook from "../parseBook";

describe("listAssets", () => {
    test("should not list glossary as asset", () => {
        const fs = createMockFS({
            "GLOSSARY.md": "# Glossary\n\n## Hello\nDescription for hello",
            "assetFile.js": "",
            assets: {
                "file.js": "",
            },
        });

        const book = Book.createForFS(fs);

        return parseGlossary(book)
            .then((resultBook) => {
                return listAssets(resultBook, Immutable.Map());
            })
            .then((assets) => {
                expect(assets.size).toBe(2);
                expect(assets.includes("assetFile.js"));
                expect(assets.includes("assets/file.js"));
            });
    });

    test("should not list README.md of pages as asset", () => {
        const fs = createMockFS({
            "book.json": JSON.stringify({
                root: "./test",
            }),
            test: {
                "SUMMARY.md": `# Summary

* [top](README.md)
* [sub](sub/README-sub.md)
* [subsub](sub/sub/README-subsub.md)

`,
                "README.md": "top",
                "sub/README-sub.md": "in sub",
                "sub/sub/README-subsub.md": "in sub/sub",
            },
        });
        const pages = new Map()
            .set("README.md", "top")
            .set("sub/README-sub.md", "sub")
            .set("sub/sub/README-subsub.md", "sub/sub");

        const book = Book.createForFS(fs);

        return parseBook(book)
            .then((resultBook) => {
                return listAssets(resultBook, pages);
            })
            .then((assets) => {
                expect(assets.size).toBe(0);
            });
    });
});
