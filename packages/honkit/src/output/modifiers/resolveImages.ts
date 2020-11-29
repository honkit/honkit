import path from "path";
import LocationUtils from "../../utils/location";
import editHTMLElement from "./editHTMLElement";

/**
 Resolve all HTML images:
 - /test.png in hello -> ../test.html

 @param {string} currentFile
 @param {HTMLDom} $
 */

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

export default resolveImages;
