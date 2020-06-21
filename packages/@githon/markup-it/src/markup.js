const parse = require("./parse");
const render = require("./render");

/**
 * Create an instance using a set of rules
 * @param {Syntax} syntax
 */
function DraftMarkup(syntax) {
    if (!(this instanceof DraftMarkup)) {
        return new DraftMarkup(syntax);
    }

    this.syntax = syntax;
}

/**
 * Convert a text into a parsed content
 * @param  {String} text
 * @return {ContentState}
 */
DraftMarkup.prototype.toContent = function toContent(text, options) {
    return parse(this.syntax, text, options);
};

/**
 * Convert a text into an inline parsed content
 * @param  {String} text
 * @return {List<Tokens>}
 */
DraftMarkup.prototype.toInlineContent = function toInlineContent(text) {
    return parse.asInline(this.syntax, text);
};

/**
 * Convert a content to text
 * @param  {ContentState} content
 * @param  {Object} options
 * @return {String}
 */
DraftMarkup.prototype.toText = function toText(content, options) {
    return render(this.syntax, content, options);
};

/**
 * Convert a content to text
 * @param  {List<Tokens>}
 * @return {String}
 */
DraftMarkup.prototype.toInlineText = function toInlineText(tokens) {
    return render.asInline(this.syntax, tokens);
};

module.exports = DraftMarkup;
