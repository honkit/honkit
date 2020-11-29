import path from "path";
import Promise from "../utils/promise";
import parsers from "../parsers";

/**
 Find a file parsable (Markdown or AsciiDoc) in a book

 @param {Book} book
 @param {string} filename
 @return {Promise<File | Undefined>}
 */

function findParsableFile(book, filename) {
    const fs = book.getContentFS();
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    const basedir = path.dirname(filename);

    // Ordered list of extensions to test
    const exts = parsers.extensions;

    return Promise.some(exts, (ext) => {
        const filepath = basename + ext;

        return fs.findFile(basedir, filepath).then((found) => {
            if (!found || book.isContentFileIgnored(found)) {
                return undefined;
            }

            return fs.statFile(found);
        });
    });
}

export default findParsableFile;
