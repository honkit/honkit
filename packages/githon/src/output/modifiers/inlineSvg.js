const path = require("path");

const fs = require("../../utils/fs");
const LocationUtils = require("../../utils/location");

const editHTMLElement = require("./editHTMLElement");
const cheerio = require("cheerio");

/**
    Inline SVG images as needed

    @param {String} rootFolder
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
            const $ = cheerio.load(svgContext, { xmlMode: true });
            const $svg = $("svg");
            if ($svg.attr("style")) {
                return;
            }
            $svg.attr("fill", "currentColor");
            $img.replaceWith($svg);
        });
    });
}

module.exports = inlineSvg;
