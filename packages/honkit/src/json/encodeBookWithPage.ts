// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeBook... Remove this comment to see the full error message
const encodeBook = require("./encodeBook");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodePage... Remove this comment to see the full error message
const encodePage = require("./encodePage");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeFile... Remove this comment to see the full error message
const encodeFile = require("./encodeFile");

/**
 * Return a JSON representation of a book with a specific file
 *
 * @param {Book} output
 * @param {Page} page
 * @return {Object}
 */
function encodeBookWithPage(book, page) {
    const file = page.getFile();

    const result = encodeBook(book);
    result.page = encodePage(page, book.getSummary());
    result.file = encodeFile(file);

    return result;
}

module.exports = encodeBookWithPage;
