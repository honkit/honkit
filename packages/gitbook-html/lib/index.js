var _ = require('lodash');
var ToText = require('./totext');

var htmlParser = {
    summary: require('./summary'),
    glossary: require('./glossary'),
    langs: require('./langs'),
    readme: require('./readme'),
    page: require('./page')
};

// Compose a function with a transform function for the first args
function compose(toHTML, fn) {
    return function() {
        var args = _.toArray(arguments);
        args[0] = toHTML(args[0]);

        return fn.apply(null, args);
    }
}

// Create a GitBook parser
function createParser(toHTML, toText) {
    var parser = {
        summary: compose(toHTML, htmlParser.summary),
        glossary: compose(toHTML, htmlParser.glossary),
        langs: compose(toHTML, htmlParser.langs),
        readme: compose(toHTML, htmlParser.readme),
        page: compose(toHTML, htmlParser.page)
    };

    var _toText = new ToText(toText);
    parser.summary.toText =_toText.summary;
    parser.langs.toText =_toText.langs;
    parser.glossary.toText =_toText.glossary;

    return parser;
}

module.exports = createParser(_.identity);
module.exports.createParser = createParser;
