const _ = require("lodash");
const ToText = require("./totext");

const htmlParser = {
    summary: require("./summary"),
    glossary: require("./glossary"),
    langs: require("./langs"),
    readme: require("./readme"),
    page: require("./page"),
};

// Compose a function with a transform function for the first argument only
function compose(toHTML, fn) {
    return function () {
        const args = _.toArray(arguments);
        args[0] = toHTML(args[0]);

        return fn.apply(null, args);
    };
}

// Create a GitBook parser from an HTML converter
function createParser(toHTML, toText) {
    if (_.isFunction(toHTML)) {
        toHTML = {
            inline: toHTML,
            block: toHTML,
        };
    }

    const parser = {
        summary: compose(toHTML.block, htmlParser.summary),
        glossary: compose(toHTML.block, htmlParser.glossary),
        langs: compose(toHTML.block, htmlParser.langs),
        readme: compose(toHTML.block, htmlParser.readme),
        page: compose(toHTML.block, htmlParser.page),
        inline: compose(toHTML.inline, htmlParser.page),
    };

    const _toText = new ToText(toText);
    parser.summary.toText = _toText.summary;
    parser.langs.toText = _toText.langs;
    parser.glossary.toText = _toText.glossary;

    return parser;
}

module.exports = createParser(_.identity);
module.exports.createParser = createParser;
