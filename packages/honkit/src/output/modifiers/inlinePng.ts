import crc from "crc";
import path from "path";
import imagesUtil from "../../utils/images";
import fs from "../../utils/fs";
import LocationUtils from "../../utils/location";
import editHTMLElement from "./editHTMLElement";

/**
 Convert all inline PNG images to PNG file

 @param {string} rootFolder
 @param {HTMLDom} $
 @return {Promise}
 */

function inlinePng(rootFolder, currentFile, $) {
    const currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, "img", ($img) => {
        const src = $img.attr("src");
        if (!LocationUtils.isDataURI(src)) {
            return;
        }

        // We avoid generating twice the same PNG
        const hash = crc.crc32(src).toString(16);
        let fileName = `${hash}.png`;

        // Result file path
        const filePath = path.join(rootFolder, fileName);

        return fs
            .assertFile(filePath, () => {
                return imagesUtil.convertInlinePNG(src, filePath);
            })
            .then(() => {
                // Convert filename to a relative filename
                fileName = LocationUtils.relative(currentDirectory, fileName);

                // Replace src
                $img.attr("src", fileName);
            });
    });
}

export default inlinePng;
