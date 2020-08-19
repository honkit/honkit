// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parsePageF... Remove this comment to see the full error message
const parsePageFromString = require("./parsePageFromString");

/**
 * Parse a page, read its content and parse the YAMl header
 *
 * @param {Book} book
 * @param {Page} page
 * @return {Promise<Page>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parsePage'... Remove this comment to see the full error message
function parsePage(book, page) {
    const fs = book.getContentFS();
    const file = page.getFile();

    return fs.readAsString(file.getPath()).then((content) => {
        return parsePageFromString(page, content);
    });
}

module.exports = parsePage;
