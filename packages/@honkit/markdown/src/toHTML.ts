import { Markup } from "@honkit/markup-it";
import markdownSyntax from "@honkit/markup-it/syntaxes/markdown";
import htmlSyntax from "@honkit/markup-it/syntaxes/html";

const markdown = new Markup(markdownSyntax);
const html = new Markup(htmlSyntax);

/**
 * Convert Markdown block to HTML
 *
 * @param {string} src (markdown)
 * @return {string} (html)
 */
function convertMdToHTMLBlock(src: string) {
    const content = markdown.toContent(src);
    const textHtml = html.toText(content);

    return textHtml;
}

/**
 * Convert Markdown inline to HTML
 *
 * @param {string} src (markdown)
 * @return {string} (html)
 */
function convertMdToHTMLInline(src) {
    const content = markdown.toInlineContent(src);
    const textHtml = html.toInlineText(content);

    return textHtml;
}

export default {
    block: convertMdToHTMLBlock,
    inline: convertMdToHTMLInline
};
