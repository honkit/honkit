// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Parser'.
const Parser = Immutable.Record({
    name: String(),

    // List of extensions that can be processed using this parser
    extensions: Immutable.List(),

    // Parsing functions
    readme: Function(),
    langs: Function(),
    summary: Function(),
    glossary: Function(),
    page: Function(),
    inline: Function(),
});

Parser.prototype.getName = function () {
    return this.get("name");
};

Parser.prototype.getExtensions = function () {
    return this.get("extensions");
};

// PARSE

Parser.prototype.parseReadme = function (content) {
    const readme = this.get("readme");
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(readme(content));
};

Parser.prototype.parseSummary = function (content) {
    const summary = this.get("summary");
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(summary(content));
};

Parser.prototype.parseGlossary = function (content) {
    const glossary = this.get("glossary");
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(glossary(content));
};

Parser.prototype.preparePage = function (content) {
    const page = this.get("page");
    if (!page.prepare) {
        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise(content);
    }

    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(page.prepare(content));
};

Parser.prototype.parsePage = function (content) {
    const page = this.get("page");
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(page(content));
};

Parser.prototype.parseInline = function (content) {
    const inline = this.get("inline");
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(inline(content));
};

Parser.prototype.parseLanguages = function (content) {
    const langs = this.get("langs");
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(langs(content));
};

Parser.prototype.parseInline = function (content) {
    const inline = this.get("inline");
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(inline(content));
};

// TO TEXT

Parser.prototype.renderLanguages = function (content) {
    const langs = this.get("langs");
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(langs.toText(content));
};

Parser.prototype.renderSummary = function (content) {
    const summary = this.get("summary");
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(summary.toText(content));
};

Parser.prototype.renderGlossary = function (content) {
    const glossary = this.get("glossary");
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise(glossary.toText(content));
};

/**
    Test if this parser matches an extension

    @param {String} ext
    @return {Boolean}
*/
Parser.prototype.matchExtension = function (ext) {
    const exts = this.getExtensions();
    return exts.includes(ext.toLowerCase());
};

/**
    Create a new parser using a module (gitbook-markdown, etc)

    @param {String} name
    @param {Array<String>} extensions
    @param {Object} module
    @return {Parser}
*/
Parser.create = function (name, extensions, module) {
    return new Parser({
        name: name,
        extensions: Immutable.List(extensions),
        readme: module.readme,
        langs: module.langs,
        summary: module.summary,
        glossary: module.glossary,
        page: module.page,
        inline: module.inline,
    });
};

module.exports = Parser;
