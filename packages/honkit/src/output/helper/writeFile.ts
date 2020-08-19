// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../../utils/fs");

/**
    Write a file to the output folder

    @param {Output} output
    @param {String} filePath
    @param {Buffer|String} content
    @return {Promise}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'writeFile'... Remove this comment to see the full error message
function writeFile(output, filePath, content) {
    const rootFolder = output.getRoot();
    filePath = path.join(rootFolder, filePath);

    return fs
        .ensureFile(filePath)
        .then(() => {
            return fs.writeFile(filePath, content);
        })
        .thenResolve(output);
}

module.exports = writeFile;
