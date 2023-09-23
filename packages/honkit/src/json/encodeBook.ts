import extend from "extend";
import honkit from "../honkit";
import encodeSummary from "./encodeSummary";
import encodeGlossary from "./encodeGlossary";
import encodeReadme from "./encodeReadme";
import encodeLanguages from "./encodeLanguages";

/**
 Encode a book to JSON

 @param {Book}
 @return {Object}
 */
function encodeBookToJson(book) {
    const config = book.getConfig();
    const language = book.getLanguage();

    const variables = config.getValue("variables", {});

    return {
        summary: encodeSummary(book.getSummary()),
        glossary: encodeGlossary(book.getGlossary()),
        readme: encodeReadme(book.getReadme()),
        config: book.getConfig().getValues().toJS(),

        languages: book.isMultilingual() ? encodeLanguages(book.getLanguages()) : undefined,

        gitbook: {
            version: honkit.version,
            time: honkit.START_TIME
        },
        honkit: {
            version: honkit.version,
            time: honkit.START_TIME
        },
        book: extend(
            {
                language: language ? language : undefined
            },
            variables.toJS()
        )
    };
}

export default encodeBookToJson;
