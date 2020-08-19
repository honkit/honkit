// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Parse'.
const Parse = require("../parse");

/**
    List all assets in the book

    @param {Output}
    @return {Promise<Output>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'prepareAss... Remove this comment to see the full error message
function prepareAssets(output) {
    const book = output.getBook();
    const pages = output.getPages();
    const logger = output.getLogger();

    return Parse.listAssets(book, pages).then((assets) => {
        logger.info.ln("found", assets.size, "asset files");

        return output.set("assets", assets);
    });
}

module.exports = prepareAssets;
