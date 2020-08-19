// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extend'.
const extend = require("extend");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'honkit'.
const honkit = require("../honkit");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeSumm... Remove this comment to see the full error message
const encodeSummary = require("./encodeSummary");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeGlos... Remove this comment to see the full error message
const encodeGlossary = require("./encodeGlossary");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeRead... Remove this comment to see the full error message
const encodeReadme = require("./encodeReadme");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeLang... Remove this comment to see the full error message
const encodeLanguages = require("./encodeLanguages");

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
            time: honkit.START_TIME,
        },
        book: extend(
            {
                language: language ? language : undefined,
            },
            variables.toJS()
        ),
    };
}

module.exports = encodeBookToJson;
