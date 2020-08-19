// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Book'.
const Book = require("../models/book");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createNode... Remove this comment to see the full error message
const createNodeFS = require("../fs/node");

/**
    Return a book instance to work on from
    command line args/kwargs

    @param {Array} args
    @param {Object} kwargs
    @return {Book}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getBook'.
function getBook(args, kwargs) {
    const input = path.resolve(args[0] || process.cwd());
    const logLevel = kwargs.log;

    const fs = createNodeFS(input);
    const book = Book.createForFS(fs);

    return book.setLogLevel(logLevel);
}

module.exports = getBook;
