// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'timing'.
const timing = require("../utils/timing");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Book'.
const Book = require("../models/book");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseIgnor... Remove this comment to see the full error message
const parseIgnore = require("./parseIgnore");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseConfi... Remove this comment to see the full error message
const parseConfig = require("./parseConfig");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseGloss... Remove this comment to see the full error message
const parseGlossary = require("./parseGlossary");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseSumma... Remove this comment to see the full error message
const parseSummary = require("./parseSummary");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseReadm... Remove this comment to see the full error message
const parseReadme = require("./parseReadme");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseLangu... Remove this comment to see the full error message
const parseLanguages = require("./parseLanguages");

/**
    Parse content of a book

    @param {Book} book
    @return {Promise<Book>}
*/
function parseBookContent(book) {
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'reduce' does not exist on type 'PromiseC... Remove this comment to see the full error message
    return Promise.reduce(
        langList,
        (currentBook, lang) => {
            const langID = lang.getID();
            const child = Book.createFromParent(currentBook, langID);
            let ignore = currentBook.getIgnore();

            // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
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
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseBook'... Remove this comment to see the full error message
function parseBook(book) {
    return timing.measure(
        "parse.book",
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
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

module.exports = parseBook;
