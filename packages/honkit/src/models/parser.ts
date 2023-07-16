import Immutable from "immutable";
import Promise from "../utils/promise";
import { Parsers } from "@honkit/html";
export type ParserOptions = {
    baseDirectory: string;
};
class Parser extends Immutable.Record({
    name: String(),

    // List of extensions that can be processed using this parser
    extensions: Immutable.List(),

    // Parsing functions
    readme: Function() as Parsers["readme"],
    langs: Function() as Parsers["langs"],
    summary: Function() as Parsers["summary"],
    glossary: Function() as Parsers["glossary"],
    page: Function() as Parsers["page"],
    inline: Function() as Parsers["inline"]
}) {
    getName(): string {
        return this.get("name");
    }

    getExtensions(): Immutable.List<string> {
        return this.get("extensions");
    }

    // PARSE

    parseReadme(content: string, options: ParserOptions) {
        const readme = this.get("readme");

        return Promise(readme(content, options));
    }

    parseSummary(content: string, options: ParserOptions) {
        const summary = this.get("summary");

        return Promise(summary(content));
    }

    parseGlossary(content: string, options: ParserOptions) {
        const glossary = this.get("glossary");

        return Promise(glossary(content, options));
    }

    preparePage(content: string) {
        const page = this.get("page");
        if (!page.prepare) {
            return Promise(content);
        }

        return Promise(page.prepare(content));
    }

    parsePage(content: string, options: ParserOptions) {
        const page = this.get("page");

        return Promise(page(content, options));
    }

    parseInline(content: string, options: ParserOptions) {
        const inline = this.get("inline");

        return Promise(inline(content, options));
    }

    parseLanguages(content: string, options: ParserOptions) {
        const langs = this.get("langs");

        return Promise(langs(content, options));
    }

    // TO TEXT

    renderLanguages(content: any) {
        const langs = this.get("langs");

        return Promise(langs.toText(content));
    }

    renderSummary(content: any) {
        const summary = this.get("summary");

        return Promise(summary.toText(content));
    }

    renderGlossary(content: any) {
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
     @return {Parsers}
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
            inline: module.inline
        });
    }
}

export default Parser;
