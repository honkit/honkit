import path from "path";
import crc from "crc";
import domSerializer from "dom-serializer";

import editHTMLElement from "./editHTMLElement";
import fs from "../../utils/fs";
import LocationUtils from "../../utils/location";

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
function svgToImg(baseFolder, currentFile, $) {
    const currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, "svg", ($svg) => {
        if ($svg.attr("fill")) {
            return;
        }

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

export default svgToImg;
