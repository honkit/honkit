var resolveImages = require("./resolveImages");
var fetchRemoteImages = require("./fetchRemoteImages");
var svgToImg = require("./svgToImg");
var inlineSvg = require("./inlineSvg");
var inlinePng = require("./inlinePng");

var Promise = require("../../utils/promise");

/**
    Inline all assets in a page

    @param {String} rootFolder
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

module.exports = inlineAssets;
