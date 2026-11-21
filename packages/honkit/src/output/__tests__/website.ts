import fs from "fs";
import path from "path";
import { PluginResolver } from "../../plugins/PluginResolver";
import generateMock from "../testing/generateMock";
import WebsiteGenerator from "../website";

const longTest = (name, fn) => test(name, fn, 1000 * 30);
describe("WebsiteGenerator", () => {
    test("should generate an index.html", async () => {
        const folder = await generateMock(WebsiteGenerator, {
            "README.md": "Hello World"
        });
        expect(folder).toHaveFile("index.html");
    }, 60 * 1000);

    longTest("should use structure.readme for index.html even if README.md exists", () => {
        return generateMock(WebsiteGenerator, {
            "book.json": "{ \"structure\": { \"readme\": \"README.other.md\" } }",
            "SUMMARY.md": "# Summary\n\n* [Default README](README.md)",
            "README.md": "default readme content",
            "README.other.md": "custom readme content"
        }).then((folder) => {
            expect(folder).toHaveFile("index.html");
            expect(folder).toHaveFile("README.html");

            const index = fs.readFileSync(`${folder}/index.html`, "utf8");
            expect(index).toContain("custom readme content");
            expect(index).not.toContain("default readme content");
            expect(index).toHaveDOMElement(".book-summary a[href=\"README.html\"]");

            const readme = fs.readFileSync(`${folder}/README.html`, "utf8");
            expect(readme).toContain("default readme content");
        });
    });

    // https://github.com/honkit/honkit/issues/453
    test("should render a summary entry to a file outside of a language book as text", async () => {
        const folder = await generateMock(WebsiteGenerator, {
            "LANGS.md": "# Languages\n\n* [en](en/)",
            "shared.pdf": "%PDF-1.4\n",
            en: {
                "README.md": "Hello",
                "SUMMARY.md": "# Summary\n\n* [Home](README.md)\n* [Shared](../shared.pdf)"
            }
        });
        const html = fs.readFileSync(`${folder}/en/index.html`, "utf8");
        expect(html).not.toHaveDOMElement('.book-summary a[href="../shared.pdf"]');
        expect(html).toMatch(/<span>\s*Shared\s*<\/span>/);
    }, 60 * 1000);

    // https://github.com/honkit/honkit/issues/453
    test("should skip summary entries to files that are not pages in the previous and next page links", async () => {
        const folder = await generateMock(WebsiteGenerator, {
            "README.md": "First",
            "second.md": "Second",
            "SUMMARY.md": "# Summary\n\n* [First](README.md)\n* [Manual](manual.pdf)\n* [License](LICENSE)\n* [Second](second.md)",
            "manual.pdf": "%PDF-1.4\n",
            LICENSE: "MIT"
        });
        const first = fs.readFileSync(`${folder}/index.html`, "utf8");
        const second = fs.readFileSync(`${folder}/second.html`, "utf8");
        expect(first).toHaveDOMElement('.navigation-next[href="second.html"]');
        expect(second).toHaveDOMElement('.navigation-prev[href="./"]');
        expect(first).toHaveDOMElement('.book-summary a[href="manual.pdf"]');
        expect(first).toHaveDOMElement('.book-summary a[href="LICENSE"]');
    }, 60 * 1000);

    // https://github.com/honkit/honkit/issues/453
    test("should link a summary entry to a copied file with an encoded name, but not to a folder", async () => {
        const folder = await generateMock(WebsiteGenerator, {
            "README.md": "Hello",
            "SUMMARY.md":
                "# Summary\n\n* [Home](README.md)\n* [Field Guide](downloads/Field%20Guide.pdf)\n* [Downloads](downloads/)",
            downloads: { "Field Guide.pdf": "%PDF-1.4\n" }
        });
        const html = fs.readFileSync(`${folder}/index.html`, "utf8");
        expect(html).toHaveDOMElement('.book-summary a[href="downloads/Field%20Guide.pdf"]');
        expect(html).not.toHaveDOMElement('.book-summary a[href="downloads"]');
        expect(html).toMatch(/<span>\s*Downloads\s*<\/span>/);
    }, 60 * 1000);

    // https://github.com/honkit/honkit/issues/453
    test("should render a summary entry to an invalid file path as text", async () => {
        const folder = await generateMock(WebsiteGenerator, {
            "README.md": "Hello",
            "SUMMARY.md":
                "# Summary\n\n* [Home](README.md)\n* [Through a file](downloads/guide.pdf)\n* [Null byte](bad%00.pdf)",
            downloads: "not a folder"
        });
        const html = fs.readFileSync(`${folder}/index.html`, "utf8");
        expect(html).toMatch(/<span>\s*Through a file\s*<\/span>/);
        expect(html).toMatch(/<span>\s*Null byte\s*<\/span>/);
    }, 60 * 1000);

    describe("Glossary", () => {
        let folder;

        beforeAll(() => {
            return generateMock(WebsiteGenerator, {
                "README.md": "Hello World",
                "SUMMARY.md": "* [Deep](folder/page.md)",
                folder: {
                    "page.md": "Hello World"
                },
                "GLOSSARY.md": "# Glossary\n\n## Hello\n\nHello World"
            }).then((_folder) => {
                folder = _folder;
            });
        });

        longTest("should generate a GLOSSARY.html", () => {
            expect(folder).toHaveFile("GLOSSARY.html");
        });

        longTest("should correctly resolve glossary links in README", () => {
            const html = fs.readFileSync(`${folder}/index.html`, "utf8");
            expect(html).toHaveDOMElement(".page-inner a[href=\"GLOSSARY.html#hello\"]");
        });

        longTest("should correctly resolve glossary links in directory", () => {
            const html = fs.readFileSync(`${folder}/folder/page.html`, "utf8");
            expect(html).toHaveDOMElement(".page-inner a[href=\"../GLOSSARY.html#hello\"]");
        });

        longTest("should accept a custom glossary file", () => {
            return generateMock(WebsiteGenerator, {
                "README.md": "Hello World",
                "book.json": "{ \"structure\": { \"glossary\": \"custom.md\" } }",
                "custom.md": "# Glossary\n\n## Hello\n\nHello World"
            }).then((folder) => {
                expect(folder).toHaveFile("custom.html");
                expect(folder).not.toHaveFile("GLOSSARY.html");

                const html = fs.readFileSync(`${folder}/index.html`, "utf8");
                expect(html).toHaveDOMElement(".page-inner a[href=\"custom.html#hello\"]");
            });
        });
    });

    test.skip("should copy asset files", () => {
        return generateMock(WebsiteGenerator, {
            "README.md": "Hello World",
            "myJsFile.js": "var a = \"test\";",
            folder: {
                "AnotherAssetFile.md": "# Even md"
            }
        }).then((folder) => {
            expect(folder).toHaveFile("index.html");
            expect(folder).toHaveFile("myJsFile.js");
            expect(folder).toHaveFile("folder/AnotherAssetFile.md");
        });
    });

    test.skip("should generate an index.html for AsciiDoc", async () => {
        const folder = await generateMock(WebsiteGenerator, {
            "README.adoc": "Hello World"
        });

        expect(folder).toHaveFile("index.html");
    });

    longTest("should generate an HTML file for each articles", () => {
        return generateMock(WebsiteGenerator, {
            "README.md": "Hello World",
            "SUMMARY.md": "# Summary\n\n* [Page](test/page.md)",
            test: {
                "page.md": "Hello 2"
            }
        }).then((folder) => {
            expect(folder).toHaveFile("index.html");
            expect(folder).toHaveFile("test/page.html");
        });
    });

    longTest("should not generate file if entry file doesn't exist", () => {
        return generateMock(WebsiteGenerator, {
            "README.md": "Hello World",
            "SUMMARY.md": "# Summary\n\n* [Page 1](page.md)\n* [Page 2](test/page.md)",
            test: {
                "page.md": "Hello 2"
            }
        }).then((folder) => {
            expect(folder).toHaveFile("index.html");
            expect(folder).not.toHaveFile("page.html");
            expect(folder).toHaveFile("test/page.html");
        });
    });

    longTest("should generate a multilingual book", () => {
        return generateMock(WebsiteGenerator, {
            "LANGS.md": "# Languages\n\n* [en](en)\n* [fr](fr)",
            en: {
                "README.md": "Hello"
            },
            fr: {
                "README.md": "Bonjour"
            }
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

    test("should copy language-specific plugin resources without overwriting other languages", async () => {
        const resolve = PluginResolver.prototype.resolvePluginPackageName;
        const resolver = jest.spyOn(PluginResolver.prototype, "resolvePluginPackageName").mockImplementation(function (name) {
            return name === "language-resources-test"
                ? path.join(__dirname, "../testing/fixtures/language-resources")
                : resolve.call(this, name);
        });
        try {
            const folder = await generateMock(WebsiteGenerator, {
                "book.json": JSON.stringify({ plugins: ["language-resources-test"] }),
                "LANGS.md": "# Languages\n\n* [en](en)\n* [fr](fr)",
                en: { "README.md": "Hello", "SUMMARY.md": "* [Home](README.md)\n* [Nested](nested/page.md)", nested: { "page.md": "Nested" } },
                fr: { "README.md": "Bonjour" }
            });
            for (const language of ["en", "fr"]) {
                const resource = `gitbook/${language}/honkit-plugin-language-resources-test/style.css`;
                expect(fs.readFileSync(path.join(folder, resource), "utf8")).toBe(`/* ${language} language resource */\n`);
                const html = fs.readFileSync(`${folder}/${language}/index.html`, "utf8");
                expect(html).toHaveDOMElement(`link[href="../${resource}"]`);
                expect(html).toHaveDOMElement('link[href="../gitbook/style.css"]');
            }
            const nested = fs.readFileSync(`${folder}/en/nested/page.html`, "utf8");
            expect(nested).toHaveDOMElement('link[href="../../gitbook/en/honkit-plugin-language-resources-test/style.css"]');
            expect(folder).toHaveFile("gitbook/style.css");
            expect(folder).not.toHaveFile("en/gitbook/style.css");
            expect(fs.readFileSync(`${folder}/gitbook/honkit-plugin-language-resources-test/style.css`, "utf8")).toBe("/* root language resource */\n");
        } finally {
            resolver.mockRestore();
        }
    }, 60 * 1000);

    longTest("should write a separate search index for each language", async () => {
        const folder = await generateMock(WebsiteGenerator, {
            "LANGS.md": "# Languages\n\n* [en](en)\n* [fr](fr)",
            en: {
                "README.md": "# Hello\n\nenglishonly"
            },
            fr: {
                "README.md": "# Bonjour\n\nfrenchonly"
            }
        });
        const readIndex = (language) =>
            JSON.parse(fs.readFileSync(`${folder}/${language}/search_index.json`, "utf8"));

        const en = readIndex("en");
        const fr = readIndex("fr");
        expect(Object.values(en.store).map((doc: any) => doc.body.trim())).toEqual(["Hello\nenglishonly"]);
        expect(Object.values(fr.store).map((doc: any) => doc.body.trim())).toEqual(["Bonjour\nfrenchonly"]);
        // The index itself, not only the store, must not contain words of the other language
        expect(JSON.stringify(en.index)).toContain("englishon");
        expect(JSON.stringify(en.index)).not.toContain("frenchon");
        expect(JSON.stringify(fr.index)).toContain("frenchon");
        expect(JSON.stringify(fr.index)).not.toContain("englishon");
    });
});
