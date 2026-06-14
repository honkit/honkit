import { loadHtml } from '@honkit/html';
import path from "path";
import { createTmpDirWithRealPath } from "../../../fs/tmpdir";
import fetchRemoteImages from "../fetchRemoteImages";
import fs from "fs/promises";
import assert from "assert";
import * as constants from "constants";

const URL =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png";

// download image from remote server is flaky
jest.retryTimes(3);
describe("fetchRemoteImages", () => {
    let dir: string;
    beforeEach(() => {
        dir = createTmpDirWithRealPath("honkit-fetch-remote-images-test-");
        return fs.rm(dir, { recursive: true, force: true });
    });
    afterEach(() => {
        // remove temporary directory
        return fs.rm(dir, { recursive: true, force: true });
    });

    it("should download image file", async () => {
        const $ = loadHtml(`<img src="${URL}" />`);

        await fetchRemoteImages(dir, "index.html", $);
        const $img = $("img");
        const src = $img.attr("src");

        const expected = path.join(dir, src);
        await assert.doesNotReject(() => {
            return fs.access(expected, constants.F_OK);
        });
    }, 15 * 1000);

    it("should download image file and replace with relative path", async () => {
        const $ = loadHtml(`<img src="${URL}" />`);

        await fetchRemoteImages(dir, "test/index.html", $);
        const $img = $("img");
        const src = $img.attr("src");

        const expected = path.join(dir, "test/" + src);
        await assert.doesNotReject(() => {
            return fs.access(expected, constants.F_OK);
        });
    }, 15 * 1000);
});
