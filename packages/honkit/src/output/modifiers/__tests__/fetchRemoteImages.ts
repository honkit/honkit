import { loadHtml } from '@honkit/html';
import tmp from "tmp";
import path from "path";
import fetchRemoteImages from "../fetchRemoteImages";
import fs from "fs/promises";
import assert from "assert";
import * as constants from "constants";

const URL =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png";

// download image from remote server is flaky
jest.retryTimes(3);
describe("fetchRemoteImages", () => {
    let dir;
    beforeEach(() => {
        dir = tmp.dirSync();
        return fs.rm(dir.name, { recursive: true, force: true });
    });
    afterEach(() => {
        // remove tmp `dir`
        return fs.rm(dir.name, { recursive: true, force: true });
    });

    it("should download image file", async () => {
        const $ = loadHtml(`<img src="${URL}" />`);

        await fetchRemoteImages(dir.name, "index.html", $);
        const $img = $("img");
        const src = $img.attr("src");

        const expected = path.join(dir.name, src);
        await assert.doesNotReject(() => {
            return fs.access(expected, constants.F_OK);
        });
    }, 15 * 1000);

    it("should download image file and replace with relative path", async () => {
        const $ = loadHtml(`<img src="${URL}" />`);

        await fetchRemoteImages(dir.name, "test/index.html", $);
        const $img = $("img");
        const src = $img.attr("src");

        const expected = path.join(dir.name, "test/" + src);
        await assert.doesNotReject(() => {
            return fs.access(expected, constants.F_OK);
        });
    }, 15 * 1000);
});
