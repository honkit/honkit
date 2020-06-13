var extend = require("extend");

var githon = require("../githon");
var encodeSummary = require("./encodeSummary");
var encodeGlossary = require("./encodeGlossary");
var encodeReadme = require("./encodeReadme");
var encodeLanguages = require("./encodeLanguages");

/**
    Encode a book to JSON

    @param {Book}
    @return {Object}
*/
function encodeBookToJson(book) {
    var config = book.getConfig();
    var language = book.getLanguage();

    var variables = config.getValue("variables", {});

    return {
        summary: encodeSummary(book.getSummary()),
        glossary: encodeGlossary(book.getGlossary()),
        readme: encodeReadme(book.getReadme()),
        config: book.getConfig().getValues().toJS(),

        languages: book.isMultilingual() ? encodeLanguages(book.getLanguages()) : undefined,

        gitbook: {
            version: githon.version,
            time: githon.START_TIME,
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
