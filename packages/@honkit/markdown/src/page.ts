import * as MarkupIt from "@honkit/markup-it";

const gitbookSyntax = require("@honkit/markup-it/syntaxes/markdown");

const RAW_START = "{% raw %}";
const RAW_END = "{% endraw %}";
const markdown = new MarkupIt.default(gitbookSyntax);

/**
 * Escape a code block's content using raw blocks
 *
 * @param {string}
 * @return {string}
 */
function escape(str: string) {
    return RAW_START + str + RAW_END;
}

/**
 * Add templating "raw" to code blocks to
 * avoid nunjucks processing their content.
 *
 * @param {string} src
 * @return {string}
 */
export function preparePage(src: string) {
    let levelRaw = 0;
    const content = markdown.toContent(src, {
        math: true,
        template: true
    });

    const textMarkdown = markdown.toText(content, {
        annotate: function (state, raw, token) {
            const tokenType = token.getType();

            if (tokenType === MarkupIt.ENTITIES.TEMPLATE) {
                const type = token.getData().get("type");
                const expr = token.getAsPlainText();

                if (type === "expr") {
                    if (expr === "raw") {
                        levelRaw = levelRaw + 1;
                    } else if (expr == "endraw") {
                        levelRaw = 0;
                    }
                }
            }

            if ((tokenType === MarkupIt.BLOCKS.CODE || tokenType === MarkupIt.STYLES.CODE) && levelRaw === 0) {
                return escape(raw);
            }

            return raw;
        }
    });

    return textMarkdown;
}
