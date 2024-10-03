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
