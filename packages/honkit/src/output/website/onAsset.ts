// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../../utils/fs");

/**
    Copy an asset to the output folder

    @param {Output} output
    @param {Page} page
*/
function onAsset(output, asset) {
    const book = output.getBook();
    const options = output.getOptions();
    const bookFS = book.getContentFS();

    const outputFolder = options.get("root");
    const outputPath = path.resolve(outputFolder, asset);

    return fs
        .ensureFile(outputPath)
        .then(() => {
            return bookFS.readAsStream(asset).then((stream) => {
                return fs.writeStream(outputPath, stream);
            });
        })
        .thenResolve(output);
}

module.exports = onAsset;
