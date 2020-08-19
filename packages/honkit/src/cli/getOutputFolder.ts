// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

/**
    Return path to output folder

    @param {Array} args
    @return {String}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getOutputF... Remove this comment to see the full error message
function getOutputFolder(args) {
    const bookRoot = path.resolve(args[0] || process.cwd());
    const defaultOutputRoot = path.join(bookRoot, "_book");
    const outputFolder = args[1] ? path.resolve(process.cwd(), args[1]) : defaultOutputRoot;

    return outputFolder;
}

module.exports = getOutputFolder;
