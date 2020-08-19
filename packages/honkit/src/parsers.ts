// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

const markdownParser = require("@honkit/markdown-legacy");
const asciidocParser = require("@honkit/asciidoc");

const EXTENSIONS_MARKDOWN = require("./constants/extsMarkdown");
const EXTENSIONS_ASCIIDOC = require("./constants/extsAsciidoc");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Parser'.
const Parser = require("./models/parser");

// This list is ordered by priority of parsers to use
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parsers'.
const parsers = Immutable.List([
    Parser.create("markdown", EXTENSIONS_MARKDOWN, markdownParser),
    Parser.create("asciidoc", EXTENSIONS_ASCIIDOC, asciidocParser),
]);

/**
 * Return a specific parser by its name
 *
 * @param {String} name
 * @return {Parser|undefined}
 */
function getParser(name) {
    return parsers.find((parser) => {
        return parser.getName() === name;
    });
}

/**
 * Return a specific parser according to an extension
 *
 * @param {String} ext
 * @return {Parser|undefined}
 */
function getParserByExt(ext) {
    return parsers.find((parser) => {
        return parser.matchExtension(ext);
    });
}

/**
 * Return parser for a file
 *
 * @param {String} ext
 * @return {Parser|undefined}
 */
function getParserForFile(filename) {
    return getParserByExt(path.extname(filename));
}

// List all parsable extensions
const extensions = parsers
    .map((parser) => {
        return parser.getExtensions();
    })
    .flatten();

module.exports = {
    extensions: extensions,
    get: getParser,
    getByExt: getParserByExt,
    getForFile: getParserForFile,
};
