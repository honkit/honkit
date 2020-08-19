// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Parse'.
const Parse = require("../parse");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");

/**
    List and prepare all pages

    @param {Output}
    @return {Promise<Output>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'preparePag... Remove this comment to see the full error message
function preparePages(output) {
    const book = output.getBook();
    const logger = book.getLogger();

    if (book.isMultilingual()) {
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise(output);
    }

    return Parse.parsePagesList(book).then((pages) => {
        logger.info.ln("found", pages.size, "pages");

        return output.set("pages", pages);
    });
}

module.exports = preparePages;
