// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PathUtils'... Remove this comment to see the full error message
const PathUtils = require("../../utils/path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../../utils/location");

const OUTPUT_EXTENSION = ".html";

/**
 * Convert a filePath (absolute) to a filename for output
 *
 * @param {Output} output
 * @param {String} filePath
 * @return {String}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fileToOutp... Remove this comment to see the full error message
function fileToOutput(output, filePath) {
    const book = output.getBook();
    const readme = book.getReadme();
    const fileReadme = readme.getFile();

    if (
        path.basename(filePath, path.extname(filePath)) == "README" ||
        (fileReadme.exists() && filePath == fileReadme.getPath())
    ) {
        filePath = path.join(path.dirname(filePath), `index${OUTPUT_EXTENSION}`);
    } else {
        filePath = PathUtils.setExtension(filePath, OUTPUT_EXTENSION);
    }

    return LocationUtils.normalize(filePath);
}

module.exports = fileToOutput;
