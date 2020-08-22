import parseStructureFile from "./parseStructureFile";
import Languages from "../models/languages";

/**
 Parse languages list from book

 @param {Book} book
 @return {Promise<Book>}
 */

function parseLanguages(book) {
    const logger = book.getLogger();

    return parseStructureFile(book, "langs").spread((file, result) => {
        if (!file) {
            return book;
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromList' does not exist on type '... Remove this comment to see the full error message
        const languages = Languages.createFromList(file, result);

        logger.debug.ln("languages index file found at", file.getPath());
        logger.info.ln("parsing multilingual book, with", languages.getList().size, "languages");

        return book.set("languages", languages);
    });
}

export default parseLanguages;
