import path from "path";
import { loadHtml } from '@honkit/html';
import resolveLinks from "../resolveLinks";

describe("resolveLinks", () => {
    function resolveFileBasic(href) {
        return `fakeDir/${href}`;
    }

    function resolveFileCustom(href) {
        if (path.extname(href) == ".md") {
            return `${href.slice(0, -3)}.html`;
        }

        return href;
    }

    describe("Absolute path", () => {
        const TEST = "<p>This is a <a href=\"/test/cool.md\"></a></p>";

        test("should resolve path starting by \"/\" in root directory", () => {
            const $ = loadHtml(TEST);

            return resolveLinks("hello.md", resolveFileBasic, $).then(() => {
                const link = $("a");
                expect(link.attr("href")).toBe("fakeDir/test/cool.md");
            });
        });

        test("should resolve path starting by \"/\" in child directory", () => {
            const $ = loadHtml(TEST);

            return resolveLinks("afolder/hello.md", resolveFileBasic, $).then(() => {
                const link = $("a");
                expect(link.attr("href")).toBe("../fakeDir/test/cool.md");
            });
        });
    });

    describe("Anchor", () => {
        test("should prevent anchors in resolution", () => {
            const TEST = "<p>This is a <a href=\"test/cool.md#an-anchor\"></a></p>";
            const $ = loadHtml(TEST);

            return resolveLinks("hello.md", resolveFileCustom, $).then(() => {
                const link = $("a");
                expect(link.attr("href")).toBe("test/cool.html#an-anchor");
            });
        });

        test("should ignore pure anchor links", () => {
            const TEST = "<p>This is a <a href=\"#an-anchor\"></a></p>";
            const $ = loadHtml(TEST);

            return resolveLinks("hello.md", resolveFileCustom, $).then(() => {
                const link = $("a");
                expect(link.attr("href")).toBe("#an-anchor");
            });
        });
    });

    describe("Custom Resolver", () => {
        const TEST = "<p>This is a <a href=\"/test/cool.md\"></a> <a href=\"afile.png\"></a></p>";

        test("should resolve path correctly for absolute path", () => {
            const $ = loadHtml(TEST);

            return resolveLinks("hello.md", resolveFileCustom, $).then(() => {
                const link = $("a").first();
                expect(link.attr("href")).toBe("test/cool.html");
            });
        });

        test("should resolve path correctly for absolute path (2)", () => {
            const $ = loadHtml(TEST);

            return resolveLinks("afodler/hello.md", resolveFileCustom, $).then(() => {
                const link = $("a").first();
                expect(link.attr("href")).toBe("../test/cool.html");
            });
        });
    });

    describe("Encoded path", () => {
        test("should resolve a page whose file name has a space", () => {
            const TEST = "<p>This is a <a href=\"my%20page.md\"></a></p>";
            const $ = loadHtml(TEST);
            const resolvePage = (href) => (href === "my page.md" ? "my page.html" : href);

            return resolveLinks("hello.md", resolvePage, $).then(() => {
                const link = $("a");
                expect(link.attr("href")).toBe("my%20page.html");
            });
        });

        // Only these files are pages. Any other path is returned as it is, like a copied asset.
        const pages = {
            "my page.md": "my page.html",
            "Field + Guide.md": "Field + Guide.html",
            "日本語.md": "日本語.html",
            "docs/a#b?.md": "docs/a#b?.html",
            "a%20b.md": "a%20b.html"
        };
        const resolvePages = (href) => pages[href] ?? href;
        const resolve = (href, currentFile = "hello.md") => {
            const $ = loadHtml(`<p><a href="${href}"></a></p>`);
            return resolveLinks(currentFile, resolvePages, $).then(() => $("a").attr("href"));
        };

        test("should resolve a page with mixed escapes", async () => {
            expect(await resolve("Field%20%2B%20Guide.md")).toBe("Field%20%2B%20Guide.html");
            expect(await resolve("Field%20+%20Guide.md")).toBe("Field%20%2B%20Guide.html");
        });

        test("should resolve a page with an encoded non-ASCII name", async () => {
            expect(await resolve("%E6%97%A5%E6%9C%AC%E8%AA%9E.md")).toBe(
                "%E6%97%A5%E6%9C%AC%E8%AA%9E.html"
            );
            expect(await resolve("日本語.md")).toBe("日本語.html");
        });

        test("should encode reserved characters of the page name once", async () => {
            expect(await resolve("/docs/a%23b%3F.md#anchor", "docs/hello.md")).toBe("a%23b%3F.html#anchor");
        });

        test("should keep the escapes of a link to a file that is not a page", async () => {
            expect(await resolve("Field%20%2B%20Guide.pdf")).toBe("Field%20%2B%20Guide.pdf");
            expect(await resolve("my%20file.pdf")).toBe("my%20file.pdf");
            expect(await resolve("100%25.pdf")).toBe("100%25.pdf");
        });

        test("should prefer a page whose file name is the encoded one", async () => {
            expect(await resolve("a%20b.md")).toBe("a%20b.html");
        });

        test("should not treat an escaped slash as a directory", async () => {
            expect(await resolve("docs%2Fa%23b%3F.md")).toBe("docs%2Fa%23b%3F.md");
        });

        test("should keep a malformed escape as it is", async () => {
            expect(await resolve("100%.md")).toBe("100%.md");
        });
    });

    describe("External link", () => {
        const TEST = "<p>This is a <a href=\"http://www.github.com\">external link</a></p>";

        test("should have target=\"_blank\" attribute", () => {
            const $ = loadHtml(TEST);

            return resolveLinks("hello.md", resolveFileBasic, $).then(() => {
                const link = $("a");
                expect(link.attr("target")).toBe("_blank");
            });
        });
    });
});
