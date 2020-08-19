// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../../utils/fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../../utils/location");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'editHTMLEl... Remove this comment to see the full error message
const editHTMLElement = require("./editHTMLElement");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cheerio'.
const cheerio = require("cheerio");

/**
    Inline SVG images as needed

    @param {String} rootFolder
    @param {HTMLDom} $
    @return {Promise}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'inlineSvg'... Remove this comment to see the full error message
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
