// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../../utils/location");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'editHTMLEl... Remove this comment to see the full error message
const editHTMLElement = require("./editHTMLElement");

/**
    Resolve all HTML images:
        - /test.png in hello -> ../test.html

    @param {String} currentFile
    @param {HTMLDom} $
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'resolveIma... Remove this comment to see the full error message
function resolveImages(currentFile, $) {
    const currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, "img", ($img) => {
        let src = $img.attr("src");

        if (src === null || src === undefined || LocationUtils.isExternal(src) || LocationUtils.isDataURI(src)) {
            return;
        }

        // Calcul absolute path for this
        src = LocationUtils.toAbsolute(src, currentDirectory, ".");

        // Convert back to relative
        src = LocationUtils.relative(currentDirectory, src);

        $img.attr("src", src);
    });
}

module.exports = resolveImages;
