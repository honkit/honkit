// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseStruc... Remove this comment to see the full error message
const parseStructureFile = require("./parseStructureFile");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Languages'... Remove this comment to see the full error message
const Languages = require("../models/languages");

/**
    Parse languages list from book

    @param {Book} book
    @return {Promise<Book>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseLangu... Remove this comment to see the full error message
function parseLanguages(book) {
    const logger = book.getLogger();

    return parseStructureFile(book, "langs").spread((file, result) => {
        if (!file) {
            return book;
        }

        const languages = Languages.createFromList(file, result);

        logger.debug.ln("languages index file found at", file.getPath());
        logger.info.ln("parsing multilingual book, with", languages.getList().size, "languages");

        return book.set("languages", languages);
    });
}

module.exports = parseLanguages;
