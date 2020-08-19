// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'crc'.
const crc = require("crc");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'editHTMLEl... Remove this comment to see the full error message
const editHTMLElement = require("./editHTMLElement");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../../utils/fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../../utils/location");

/**
    Fetch all remote images

    @param {String} rootFolder
    @param {String} currentFile
    @param {HTMLDom} $
    @return {Promise}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fetchRemot... Remove this comment to see the full error message
function fetchRemoteImages(rootFolder, currentFile, $) {
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

module.exports = fetchRemoteImages;
