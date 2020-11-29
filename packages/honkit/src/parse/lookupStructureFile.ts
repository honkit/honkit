import findParsableFile from "./findParsableFile";

/**
 Lookup a structure file (ex: SUMMARY.md, GLOSSARY.md) in a book. Uses
 book's config to find it.

 @param {Book} book
 @param {string} type: one of ["glossary", "readme", "summary", "langs"]
 @return {Promise<File | Undefined>} The path of the file found, relative
 to the book content root.
 */

function lookupStructureFile(book, type) {
    const config = book.getConfig();

    const fileToSearch = config.getValue(["structure", type]);

    return findParsableFile(book, fileToSearch);
}

export default lookupStructureFile;
