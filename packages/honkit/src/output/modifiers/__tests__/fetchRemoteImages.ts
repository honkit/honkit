import * as cheerio from "cheerio";
import tmp from "tmp";
import path from "path";
import fetchRemoteImages from "../fetchRemoteImages";

const URL =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png";

describe.skip("fetchRemoteImages", () => {
    let dir;
    beforeEach(() => {
        dir = tmp.dirSync();
    });

    test("should download image file", () => {
        const $ = cheerio.load(`<img src="${URL}" />`, { _useHtmlParser2: true });

        return fetchRemoteImages(dir.name, "index.html", $).then(() => {
            const $img = $("img");
            const src = $img.attr("src");

            expect(dir.name).toHaveFile(src);
        });
    });

    test("should download image file and replace with relative path", () => {
        const $ = cheerio.load(`<img src="${URL}" />`, { _useHtmlParser2: true });

        return fetchRemoteImages(dir.name, "test/index.html", $).then(() => {
            const $img = $("img");
            const src = $img.attr("src");

            expect(dir.name).toHaveFile(path.join("test", src));
        });
    });
});
