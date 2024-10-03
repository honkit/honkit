import path from "path";
import fs from "../../utils/fs";
import LocationUtils from "../../utils/location";
import editHTMLElement from "./editHTMLElement";
import * as cheerio from "cheerio";

/**
 Inline SVG images as needed

 @param {string} rootFolder
 @param {HTMLDom} $
 @return {Promise}
 */

function inlineSvg(rootFolder, currentFile, $) {
    const currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, "img", ($img) => {
        let src = $img.attr("src");
        if (path.extname(src) !== ".svg") {
            return;
        }

        // Calcul absolute path for this
        src = LocationUtils.toAbsolute(src, currentDirectory, ".");
        const inputPath = path.join(rootFolder, src);

        return fs.readFile(inputPath).then((svgContext) => {
            // @ts-expect-error
            const $ = cheerio.load(svgContext, { _useHtmlParser2: true, xmlMode: true });
            const $svg = $("svg");
            if ($svg.attr("style")) {
                return;
            }
            $svg.attr("fill", "currentColor");
            $img.replaceWith($svg);
        });
    });
}

export default inlineSvg;
