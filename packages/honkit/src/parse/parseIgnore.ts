import Promise from "../utils/promise";
import IGNORE_FILES from "../constants/ignoreFiles";

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
    "_layouts"
];

/**
 Parse ignore files

 @param {Book}
 @return {Book}
 */

function parseIgnore(book) {
    if (book.isLanguageBook()) {
        return Promise.reject(new Error("Ignore files could be parsed for language books"));
    }

    const fs = book.getFS();
    let ignore = book.getIgnore();

    ignore = ignore.add(DEFAULT_IGNORES);

    return Promise.serie(IGNORE_FILES, (filename) => {
        return fs.readAsString(filename).then(
            (content) => {
                ignore = ignore.add(content.toString().split(/\r?\n/));
            },
            (err) => {
                return Promise();
            }
        );
    }).then(() => {
        return book.setIgnore(ignore);
    });
}

export default parseIgnore;
