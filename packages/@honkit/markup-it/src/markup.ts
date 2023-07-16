import parse from "./parse";
import render from "./render";

class DraftMarkup {
    private syntax: any;

    /**
     * Create an instance using a set of rules
     * @param {Syntax} syntax
     */
    constructor(syntax: any) {
        this.syntax = syntax;
    }

    /**
     * Convert a text into an inline parsed content
     * @param  {string} text
     * @return {List<Tokens>}
     */
    toInlineText(tokens) {
        return render.asInline(this.syntax, tokens);
    }

    /**
     * Convert a content to text
     * @param  {ContentState} content
     * @param  {Object} options
     * @return {string}
     */
    toContent(text, options?: {}) {
        return parse(this.syntax, text, options);
    }

    /**
     * Convert a text into an inline parsed content
     * @param  {string} text
     * @return {List<Tokens>}
     */
    toInlineContent(text) {
        return parse.asInline(this.syntax, text);
    }

    /**
     * Convert a content to text
     * @param  {ContentState} content
     * @param  {Object} options
     * @return {string}
     */
    toText(content, options?: {}) {
        return render(this.syntax, content, options);
    }
}

export default DraftMarkup;
