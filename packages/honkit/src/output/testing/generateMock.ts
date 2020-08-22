import createMockFS from "../../fs/mock";

import tmp from "tmp";
import Book from "../../models/book";
import parseBook from "../../parse/parseBook";

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

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'createForFS' does not exist on type 'Cla... Remove this comment to see the full error message
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

export default generateMock;
