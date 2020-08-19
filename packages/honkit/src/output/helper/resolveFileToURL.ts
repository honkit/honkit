// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../../utils/location");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fileToURL'... Remove this comment to see the full error message
const fileToURL = require("./fileToURL");

/**
 * Resolve an absolute path (extracted from a link)
 *
 * @param {Output} output
 * @param {String} filePath
 * @return {String}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'resolveFil... Remove this comment to see the full error message
function resolveFileToURL(output, filePath) {
    // Convert /test.png -> test.png
    filePath = LocationUtils.toAbsolute(filePath, "", "");

    const page = output.getPage(filePath);

    // if file is a page, return correct .html url
    if (page) {
        filePath = fileToURL(output, filePath);
    }

    return LocationUtils.normalize(filePath);
}

module.exports = resolveFileToURL;
