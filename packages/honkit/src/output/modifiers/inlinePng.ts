// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'crc'.
const crc = require("crc");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

const imagesUtil = require("../../utils/images");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../../utils/fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../../utils/location");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'editHTMLEl... Remove this comment to see the full error message
const editHTMLElement = require("./editHTMLElement");

/**
    Convert all inline PNG images to PNG file

    @param {String} rootFolder
    @param {HTMLDom} $
    @return {Promise}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'inlinePng'... Remove this comment to see the full error message
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

module.exports = inlinePng;
