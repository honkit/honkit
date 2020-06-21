import path from "path";
import Immutable from "immutable";

import markdownParser from "@githon/markdown";
import asciidocParser from "@githon/asciidoc";

import EXTENSIONS_MARKDOWN from "./constants/extsMarkdown";
import EXTENSIONS_ASCIIDOC from "./constants/extsAsciidoc";
import Parser from "./models/parser";

// This list is ordered by priority of parsers to use
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

export default {
    extensions: extensions,
    get: getParser,
    getByExt: getParserByExt,
    getForFile: getParserForFile,
};
