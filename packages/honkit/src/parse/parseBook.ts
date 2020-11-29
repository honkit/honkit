import Promise from "../utils/promise";
import timing from "../utils/timing";
import Book from "../models/book";
import parseIgnore from "./parseIgnore";
import parseConfig from "./parseConfig";
import parseGlossary from "./parseGlossary";
import parseSummary from "./parseSummary";
import parseReadme from "./parseReadme";
import parseLanguages from "./parseLanguages";

/**
 Parse content of a book

 @param {Book} book
 @return {Promise<Book>}
 */
function parseBookContent(book) {
    return Promise(book).then(parseReadme).then(parseSummary).then(parseGlossary);
}

/**
 Parse a multilingual book

 @param {Book} book
 @return {Promise<Book>}
 */
function parseMultilingualBook(book) {
    const languages = book.getLanguages();
    const langList = languages.getList();

    return Promise.reduce(
        langList,
        (currentBook, lang) => {
            const langID = lang.getID();

            const child = Book.createFromParent(currentBook, langID);
            let ignore = currentBook.getIgnore();

            return Promise(child)
                .then(parseConfig)
                .then(parseBookContent)
                .then((result) => {
                    // Ignore content of this book when generating parent book
                    ignore = ignore.add(`${langID}/**`);
                    currentBook = currentBook.set("ignore", ignore);

                    return currentBook.addLanguageBook(langID, result);
                });
        },
        book
    );
}

/**
 Parse a whole book from a filesystem

 @param {Book} book
 @return {Promise<Book>}
 */

function parseBook(book) {
    return timing.measure(
        "parse.book",

        Promise(book)
            .then(parseIgnore)
            .then(parseConfig)
            .then(parseLanguages)
            .then((resultBook) => {
                if (resultBook.isMultilingual()) {
                    return parseMultilingualBook(resultBook);
                } else {
                    return parseBookContent(resultBook);
                }
            })
    );
}

export default parseBook;
