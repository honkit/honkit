import parseStructureFile from "./parseStructureFile";
import Glossary from "../models/glossary";

/**
 Parse glossary

 @param {Book} book
 @return {Promise<Book>}
 */

function parseGlossary(book) {
    const logger = book.getLogger();

    return parseStructureFile(book, "glossary").spread((file, entries) => {
        if (!file) {
            return book;
        }

        logger.debug.ln("glossary index file found at", file.getPath());

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromEntries' does not exist on typ... Remove this comment to see the full error message
        const glossary = Glossary.createFromEntries(file, entries);
        return book.set("glossary", glossary);
    });
}

export default parseGlossary;
