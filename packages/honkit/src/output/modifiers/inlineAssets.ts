// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'resolveIma... Remove this comment to see the full error message
const resolveImages = require("./resolveImages");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fetchRemot... Remove this comment to see the full error message
const fetchRemoteImages = require("./fetchRemoteImages");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'svgToImg'.
const svgToImg = require("./svgToImg");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'inlineSvg'... Remove this comment to see the full error message
const inlineSvg = require("./inlineSvg");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'inlinePng'... Remove this comment to see the full error message
const inlinePng = require("./inlinePng");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../../utils/promise");

/**
    Inline all assets in a page

    @param {String} rootFolder
*/
function inlineAssets(rootFolder, currentFile) {
    return function ($) {
        return (
            // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
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
