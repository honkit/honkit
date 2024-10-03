import path from "path";
import { loadHtml } from '@honkit/html';
import resolveImages from "../resolveImages";

describe("resolveImages", () => {
    describe("img tag", () => {
        const TEST = "<img src=\"http://www.github.com\">";

        test("no error occurs and return undefined", () => {
            const $ = loadHtml(TEST);

            return resolveImages("hello.md", $).then(() => {
                const src = $("img").attr("src");
                expect(src).toBe("http://www.github.com");
            });
        });
    });
    describe("img tag with break line", () => {
        const TEST = "<img \nsrc=\"http://www.github.com\">";

        test("no error occurs and return undefined", () => {
            const $ = loadHtml(TEST);
            return resolveImages("hello.md", $).then(() => {
                const src = $("img").attr("src");
                expect(src).toBe("http://www.github.com");
            });
        });
    });
    describe("img tag with src with plus sign", () => {
        const TEST = "<img +src=\"http://www.github.com\">";

        test("no error occurs and return undefined", () => {
            const $ = loadHtml(TEST);

            return resolveImages("hello.md", $).then(() => {
                const src = $("img").attr("src");
                expect(src).toBe(undefined);
            });
        });
    });
});
