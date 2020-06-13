const fs = require("fs");
const generateMock = require("../testing/generateMock");
const WebsiteGenerator = require("../website");

describe("WebsiteGenerator", () => {
    test("should generate an index.html", () => {
        return generateMock(WebsiteGenerator, {
            "README.md": "Hello World",
        }).then((folder) => {
            expect(folder).toHaveFile("index.html");
        });
    });

    describe("Glossary", () => {
        let folder;

        beforeAll(() => {
            return generateMock(WebsiteGenerator, {
                "README.md": "Hello World",
                "SUMMARY.md": "* [Deep](folder/page.md)",
                folder: {
                    "page.md": "Hello World",
                },
                "GLOSSARY.md": "# Glossary\n\n## Hello\n\nHello World",
            }).then((_folder) => {
                folder = _folder;
            });
        });

        test("should generate a GLOSSARY.html", () => {
            expect(folder).toHaveFile("GLOSSARY.html");
        });

        test("should correctly resolve glossary links in README", () => {
            const html = fs.readFileSync(`${folder}/index.html`, "utf8");
            expect(html).toHaveDOMElement(".page-inner a[href=\"GLOSSARY.html#hello\"]");
        });

        test("should correctly resolve glossary links in directory", () => {
            const html = fs.readFileSync(`${folder}/folder/page.html`, "utf8");
            expect(html).toHaveDOMElement(".page-inner a[href=\"../GLOSSARY.html#hello\"]");
        });

        test("should accept a custom glossary file", () => {
            return generateMock(WebsiteGenerator, {
                "README.md": "Hello World",
                "book.json": "{ \"structure\": { \"glossary\": \"custom.md\" } }",
                "custom.md": "# Glossary\n\n## Hello\n\nHello World",
            }).then((folder) => {
                expect(folder).toHaveFile("custom.html");
                expect(folder).not.toHaveFile("GLOSSARY.html");

                const html = fs.readFileSync(`${folder}/index.html`, "utf8");
                expect(html).toHaveDOMElement(".page-inner a[href=\"custom.html#hello\"]");
            });
        });
    });

    test("should copy asset files", () => {
        return generateMock(WebsiteGenerator, {
            "README.md": "Hello World",
            "myJsFile.js": "var a = \"test\";",
            folder: {
                "AnotherAssetFile.md": "# Even md",
            },
        }).then((folder) => {
            expect(folder).toHaveFile("index.html");
            expect(folder).toHaveFile("myJsFile.js");
            expect(folder).toHaveFile("folder/AnotherAssetFile.md");
        });
    });

    test("should generate an index.html for AsciiDoc", () => {
        return generateMock(WebsiteGenerator, {
            "README.adoc": "Hello World",
        }).then((folder) => {
            expect(folder).toHaveFile("index.html");
        });
    });

    test("should generate an HTML file for each articles", () => {
        return generateMock(WebsiteGenerator, {
            "README.md": "Hello World",
            "SUMMARY.md": "# Summary\n\n* [Page](test/page.md)",
            test: {
                "page.md": "Hello 2",
            },
        }).then((folder) => {
            expect(folder).toHaveFile("index.html");
            expect(folder).toHaveFile("test/page.html");
        });
    });

    test("should not generate file if entry file doesn't exist", () => {
        return generateMock(WebsiteGenerator, {
            "README.md": "Hello World",
            "SUMMARY.md": "# Summary\n\n* [Page 1](page.md)\n* [Page 2](test/page.md)",
            test: {
                "page.md": "Hello 2",
            },
        }).then((folder) => {
            expect(folder).toHaveFile("index.html");
            expect(folder).not.toHaveFile("page.html");
            expect(folder).toHaveFile("test/page.html");
        });
    });

    test("should generate a multilingual book", () => {
        return generateMock(WebsiteGenerator, {
            "LANGS.md": "# Languages\n\n* [en](en)\n* [fr](fr)",
            en: {
                "README.md": "Hello",
            },
            fr: {
                "README.md": "Bonjour",
            },
        }).then((folder) => {
            // It should generate languages
            expect(folder).toHaveFile("en/index.html");
            expect(folder).toHaveFile("fr/index.html");

            // Should not copy languages as assets
            expect(folder).not.toHaveFile("en/README.md");
            expect(folder).not.toHaveFile("fr/README.md");

            // Should copy assets only once
            expect(folder).toHaveFile("gitbook/style.css");
            expect(folder).not.toHaveFile("en/gitbook/style.css");

            expect(folder).toHaveFile("index.html");
        });
    });
});
