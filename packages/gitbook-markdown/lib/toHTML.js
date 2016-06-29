var MarkupIt = require('markup-it');
var markdownSyntax = require('markup-it/syntaxes/markdown');
var htmlSyntax = require('markup-it/syntaxes/html');

var markdown = new MarkupIt(markdownSyntax);
var html     = new MarkupIt(htmlSyntax);

/**
 * Convert Markdown block to HTML
 *
 * @param {String} src (markdown)
 * @return {String} (html)
 */
function convertMdToHTMLBlock(src) {
    var content  = markdown.toContent(src);
    var textHtml = html.toText(content);

    return textHtml;
}

/**
 * Convert Markdown inline to HTML
 *
 * @param {String} src (markdown)
 * @return {String} (html)
 */
function convertMdToHTMLInline(src) {
    var content  = markdown.toInlineContent(src);
    var textHtml = html.toInlineText(content);

    return textHtml;
}

module.exports = {
    block: convertMdToHTMLBlock,
    inline: convertMdToHTMLInline
};
