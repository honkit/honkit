// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parsers'.
const parsers = require("../parsers");

/**
    Find a file parsable (Markdown or AsciiDoc) in a book

    @param {Book} book
    @param {String} filename
    @return {Promise<File | Undefined>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'findParsab... Remove this comment to see the full error message
function findParsableFile(book, filename) {
    const fs = book.getContentFS();
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    const basedir = path.dirname(filename);

    // Ordered list of extensions to test
    const exts = parsers.extensions;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'some' does not exist on type 'PromiseCon... Remove this comment to see the full error message
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

module.exports = findParsableFile;
