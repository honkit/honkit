// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'findParsab... Remove this comment to see the full error message
const findParsableFile = require("./findParsableFile");

/**
    Lookup a structure file (ex: SUMMARY.md, GLOSSARY.md) in a book. Uses
    book's config to find it.

    @param {Book} book
    @param {String} type: one of ["glossary", "readme", "summary", "langs"]
    @return {Promise<File | Undefined>} The path of the file found, relative
    to the book content root.
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'lookupStru... Remove this comment to see the full error message
function lookupStructureFile(book, type) {
    const config = book.getConfig();

    const fileToSearch = config.getValue(["structure", type]);

    return findParsableFile(book, fileToSearch);
}

module.exports = lookupStructureFile;
