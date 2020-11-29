import resolveImages from "./resolveImages";
import fetchRemoteImages from "./fetchRemoteImages";
import svgToImg from "./svgToImg";
import inlineSvg from "./inlineSvg";
import inlinePng from "./inlinePng";
import Promise from "../../utils/promise";

/**
 Inline all assets in a page

 @param {string} rootFolder
 */
function inlineAssets(rootFolder, currentFile) {
    return function ($) {
        return (
            Promise()
                // Resolving images and fetching external images should be
                // done before svg conversion
                .then(resolveImages.bind(null, currentFile, $))
                .then(fetchRemoteImages.bind(null, rootFolder, currentFile, $))

                .then(svgToImg.bind(null, rootFolder, currentFile, $))
                .then(inlineSvg.bind(null, rootFolder, currentFile, $))
                .then(inlinePng.bind(null, rootFolder, currentFile, $))
        );
    };
}

export default inlineAssets;
