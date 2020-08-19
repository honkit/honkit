// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../../utils/location");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fileToOutp... Remove this comment to see the full error message
const fileToOutput = require("./fileToOutput");

/**
    Convert a filePath (absolute) to an url (without hostname).
    It returns an absolute path.

    "README.md" -> "/"
    "test/hello.md" -> "test/hello.html"
    "test/README.md" -> "test/"

    @param {Output} output
    @param {String} filePath
    @return {String}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fileToURL'... Remove this comment to see the full error message
function fileToURL(output, filePath) {
    const options = output.getOptions();
    const directoryIndex = options.get("directoryIndex");

    filePath = fileToOutput(output, filePath);

    if (directoryIndex && path.basename(filePath) == "index.html") {
        filePath = `${path.dirname(filePath)}/`;
    }

    return LocationUtils.normalize(filePath);
}

module.exports = fileToURL;
