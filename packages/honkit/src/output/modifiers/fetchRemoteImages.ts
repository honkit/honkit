import path from "path";
import crc from "crc";
import editHTMLElement from "./editHTMLElement";
import fs from "../../utils/fs";
import LocationUtils from "../../utils/location";
import type cheerio from "cheerio";

/**
 Fetch all remote images
 */

function fetchRemoteImages(rootFolder: string, currentFile: string, $: cheerio.CheerioAPI): Promise<any> {
    const currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, "img", ($img) => {
        let src = $img.attr("src");
        const extension = path.extname(src);

        if (!LocationUtils.isExternal(src)) {
            return;
        }

        // We avoid generating twice the same PNG
        const hash = crc.crc32(src).toString(16);
        const fileName = hash + extension;
        const filePath = path.join(rootFolder, fileName);

        return fs
            .assertFile(filePath, () => {
                return fs.download(src, filePath);
            })
            .then(() => {
                // Convert to relative
                src = LocationUtils.relative(currentDirectory, fileName);

                $img.replaceWith(`<img src="${src}" />`);
            });
    });
}

export default fetchRemoteImages;
