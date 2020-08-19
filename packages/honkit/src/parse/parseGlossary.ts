// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseStruc... Remove this comment to see the full error message
const parseStructureFile = require("./parseStructureFile");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Glossary'.
const Glossary = require("../models/glossary");

/**
    Parse glossary

    @param {Book} book
    @return {Promise<Book>}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseGloss... Remove this comment to see the full error message
function parseGlossary(book) {
    const logger = book.getLogger();

    return parseStructureFile(book, "glossary").spread((file, entries) => {
        if (!file) {
            return book;
        }

        logger.debug.ln("glossary index file found at", file.getPath());

        const glossary = Glossary.createFromEntries(file, entries);
        return book.set("glossary", glossary);
    });
}

module.exports = parseGlossary;
