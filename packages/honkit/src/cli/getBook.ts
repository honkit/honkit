import path from "path";
import Book from "../models/book";
import createNodeFS from "../fs/node";

/**
 Return a book instance to work on from
 command line args/kwargs

 @param {Array} args
 @param {Object} kwargs
 @return {Book}
 */

function getBook(args, kwargs) {
    const input = path.resolve(args[0] || process.cwd());
    const logLevel = kwargs.log;

    const fs = createNodeFS(input);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'createForFS' does not exist on type 'Cla... Remove this comment to see the full error message
    const book = Book.createForFS(fs);

    return book.setLogLevel(logLevel);
}

export default getBook;
