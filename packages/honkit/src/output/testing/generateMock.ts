import createMockFS from "../../fs/mock";

import tmp from "tmp";
import Book from "../../models/book";
import parseBook from "../../parse/parseBook";
import { generateBook } from "../generateBook";

/**
 * Generate a book using a generator
 * And returns the path to the output dir.
 *
 * FOR TESTING PURPOSE ONLY
 *
 * @param Generator
 * @param {Map<String:String|Map>} files
 * @return {Promise<String>}
 */
export function generateMockBook(Generator, files) {
    const fs = createMockFS(files);

    let book = Book.createForFS(fs);
    const dir = tmp.dirSync();

    book = book.setLogLevel("disabled");

    return parseBook(book)
        .then((resultBook) => {
            return generateBook(Generator, resultBook, {
                root: dir.name
            });
        })
        .then((output) => {
            return {
                book,
                output,
                dir: dir.name
            };
        });
}

/**
 * Generate a book using a generator
 * And returns the path to the output dir.
 *
 * FOR TESTING PURPOSE ONLY
 *
 * @param Generator
 * @param {Map<String:String|Map>} files
 * @return {Promise<String>}
 */
function generateMock(Generator, files) {
    return generateMockBook(Generator, files).then((ret) => ret.dir);
}

export default generateMock;
