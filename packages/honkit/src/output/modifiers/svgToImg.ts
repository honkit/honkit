// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'crc'.
const crc = require("crc");
const domSerializer = require("dom-serializer");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'editHTMLEl... Remove this comment to see the full error message
const editHTMLElement = require("./editHTMLElement");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../../utils/fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../../utils/location");

/**
    Render a cheerio DOM as html

    @param {HTMLDom} $
    @param {HTMLElement} dom
    @param {Object}
    @return {String}
*/
function renderDOM($, dom, options) {
    if (!dom && $._root && $._root.children) {
        dom = $._root.children;
    }
    options = options || dom.options || $._options;
    return domSerializer(dom, options);
}

/**
    Replace SVG tag by IMG

    @param {String} baseFolder
    @param {HTMLDom} $
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'svgToImg'.
function svgToImg(baseFolder, currentFile, $) {
    const currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, "svg", ($svg) => {
        if ($svg.attr("fill")) {
            return;
        }

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        const content = `<?xml version="1.0" encoding="UTF-8"?>${renderDOM($, $svg)}`;

        // We avoid generating twice the same PNG
        const hash = crc.crc32(content).toString(16);
        const fileName = `${hash}.svg`;
        const filePath = path.join(baseFolder, fileName);

        // Write the svg to the file
        return (
            fs
                .assertFile(filePath, () => {
                    return fs.writeFile(filePath, content, "utf8");
                })

                // Return as image
                .then(() => {
                    const src = LocationUtils.relative(currentDirectory, fileName);
                    $svg.replaceWith(`<img src="${src}" />`);
                })
        );
    });
}

module.exports = svgToImg;
