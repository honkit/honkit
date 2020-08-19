// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("../../utils/fs");

/**
    Resolve path to cover file to use

    @param {Output}
    @return {String}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getCoverPa... Remove this comment to see the full error message
function getCoverPath(output) {
    const outputRoot = output.getRoot();
    const book = output.getBook();
    const config = book.getConfig();
    const coverName = config.getValue("cover", "cover.jpg");

    // Resolve to absolute
    let cover = fs.pickFile(outputRoot, coverName);
    if (cover) {
        return cover;
    }

    // Multilingual? try parent folder
    if (book.isLanguageBook()) {
        cover = fs.pickFile(path.join(outputRoot, ".."), coverName);
    }

    return cover;
}

module.exports = getCoverPath;
