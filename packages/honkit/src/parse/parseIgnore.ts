// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
const IGNORE_FILES = require("../constants/ignoreFiles");

const DEFAULT_IGNORES = [
    // Skip Git stuff
    ".git/",

    // Skip OS X meta data
    ".DS_Store",

    // Skip stuff installed by plugins
    "node_modules",

    // Skip book outputs
    "_book",

    // Ignore files in the templates folder
    "_layouts",
];

/**
    Parse ignore files

    @param {Book}
    @return {Book}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseIgnor... Remove this comment to see the full error message
function parseIgnore(book) {
    if (book.isLanguageBook()) {
        return Promise.reject(new Error("Ignore files could be parsed for language books"));
    }

    const fs = book.getFS();
    let ignore = book.getIgnore();

    ignore = ignore.add(DEFAULT_IGNORES);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'serie' does not exist on type 'PromiseCo... Remove this comment to see the full error message
    return Promise.serie(IGNORE_FILES, (filename) => {
        return fs.readAsString(filename).then(
            (content) => {
                ignore = ignore.add(content.toString().split(/\r?\n/));
            },
            (err) => {
                // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
                return Promise();
            }
        );
    }).then(() => {
        return book.setIgnore(ignore);
    });
}

module.exports = parseIgnore;
