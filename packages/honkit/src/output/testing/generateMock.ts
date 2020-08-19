// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tmp'.
const tmp = require("tmp");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Book'.
const Book = require("../../models/book");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createMock... Remove this comment to see the full error message
const createMockFS = require("../../fs/mock");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseBook'... Remove this comment to see the full error message
const parseBook = require("../../parse/parseBook");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generateBo... Remove this comment to see the full error message
const generateBook = require("../generateBook").generateBook;

/**
 * Generate a book using a generator
 * And returns the path to the output dir.
 *
 * FOR TESTING PURPOSE ONLY
 *
 * @param {Generator}
 * @param {Map<String:String|Map>} files
 * @return {Promise<String>}
 */
function generateMock(Generator, files) {
    const fs = createMockFS(files);
    let book = Book.createForFS(fs);
    const dir = tmp.dirSync();

    book = book.setLogLevel("disabled");

    return parseBook(book)
        .then((resultBook) => {
            return generateBook(Generator, resultBook, {
                root: dir.name,
            });
        })
        .thenResolve(dir.name);
}

module.exports = generateMock;
