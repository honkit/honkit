import _ from "lodash";
import ToText from "./totext";
// import
import summary, { SummaryPart } from "./summary";
import glossary from "./glossary";
import langs from "./langs";
import readme from "./readme";
import page from "./page";

const htmlParser = {
    summary,
    glossary,
    langs,
    readme,
    page
};

/**
 * Utility for loading HTML content
 */
export { loadHtml } from "./dom";
export type ToHTMLOptions = {
    baseDirectory: string;
};
export type ToHTMLFunction = (content: string, options?: ToHTMLOptions) => string;
// TODO: content is a parts of ???
export type ToTextFunction = (content: any) => string;
export type { SummaryPart };
export type ParserSummary = ((
    content: string,
    options?: ToHTMLOptions
) => {
    parts: SummaryPart[];
}) & {
    toText: ToTextFunction;
};
export type ParserGlossary = ((content: string, options?: ToHTMLOptions) => string[]) & {
    toText: ToTextFunction;
};
export type ParserLangs = ((content: string, options?: ToHTMLOptions) => string[]) & {
    toText: ToTextFunction;
};
export type ParserREADME = (
    content: string,
    options?: ToHTMLOptions
) => {
    title: string;
    description: string;
};
export type ParserPage = ((
    content: string,
    options?: ToHTMLOptions
) => {
    content: string;
}) & {
    // markdown parser has a preparePage function
    // it is custom page escaping function
    prepare?: (content: string, options?: ToHTMLOptions) => string;
};
export type ParserInline = (
    content: string,
    options?: ToHTMLOptions
) => {
    content: string;
};
export type Parsers = {
    summary: ParserSummary;
    glossary: ParserGlossary;
    langs: ParserLangs;
    readme: ParserREADME;
    page: ParserPage;
    inline: ParserInline;
};

// Compose a function with a transform function for the first argument only
function compose(toHTML, fn) {
    return function (content: string, options: ToHTMLOptions) {
        // e.g. convert asciidoc to html
        const html = toHTML(content, options);
        return fn.call(this, html);
    };
}

// Create a HonKit parser from an HTML converter
function createParser(toHTML, toText = undefined): Parsers {
    if (typeof toHTML === "function") {
        toHTML = {
            inline: toHTML,
            block: toHTML
        };
    }

    const parser: any = {
        summary: compose(toHTML.block, htmlParser.summary),
        glossary: compose(toHTML.block, htmlParser.glossary),
        langs: compose(toHTML.block, htmlParser.langs),
        readme: compose(toHTML.block, htmlParser.readme),
        page: compose(toHTML.block, htmlParser.page),
        inline: compose(toHTML.inline, htmlParser.page)
    };

    // @ts-expect-error
    const _toText = new ToText(toText);
    parser.summary.toText = _toText.summary;
    parser.langs.toText = _toText.langs;
    parser.glossary.toText = _toText.glossary;

    return parser;
}

const defaultParser = createParser(_.identity);
export { defaultParser as default, createParser };
