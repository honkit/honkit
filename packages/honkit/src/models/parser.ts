import Immutable from "immutable";
import Promise from "../utils/promise";

class Parser extends Immutable.Record({
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
}) {
    getName(): string {
        return this.get("name");
    }

    getExtensions(): Immutable.List<string> {
        return this.get("extensions");
    }

    // PARSE

    parseReadme(content: string) {
        const readme = this.get("readme");

        return Promise(readme(content));
    }

    parseSummary(content: string) {
        const summary = this.get("summary");

        return Promise(summary(content));
    }

    parseGlossary(content: string) {
        const glossary = this.get("glossary");

        return Promise(glossary(content));
    }

    preparePage(content: string) {
        const page = this.get("page");
        if (!page.prepare) {
            return Promise(content);
        }

        return Promise(page.prepare(content));
    }

    parsePage(content: string) {
        const page = this.get("page");

        return Promise(page(content));
    }

    parseInline(content: string) {
        const inline = this.get("inline");

        return Promise(inline(content));
    }

    parseLanguages(content: string) {
        const langs = this.get("langs");

        return Promise(langs(content));
    }

    // TO TEXT

    renderLanguages(content: string) {
        const langs = this.get("langs");

        return Promise(langs.toText(content));
    }

    renderSummary(content: string) {
        const summary = this.get("summary");

        return Promise(summary.toText(content));
    }

    renderGlossary(content: string) {
        const glossary = this.get("glossary");

        return Promise(glossary.toText(content));
    }

    /**
     Test if this parser matches an extension

     @param {string} ext
     @return {boolean}
     */
    matchExtension(ext: string) {
        const exts = this.getExtensions();
        return exts.includes(ext.toLowerCase());
    }

    /**
     Create a new parser using a module (gitbook-markdown, etc)

     @param {string} name
     @param {Array<String>} extensions
     @param {Object} module
     @return {Parser}
     */
    static create(
        name: string,
        extensions: string[] | Immutable.Iterable.Indexed<unknown>,
        module: { readme: any; langs: any; summary: any; glossary: any; page: any; inline: any }
    ) {
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
    }
}

export default Parser;
