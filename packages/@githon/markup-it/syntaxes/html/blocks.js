const MarkupIt = require("../../");
const HTMLRule = require("./rule");

const tableRules = require("./table");
const listRules = require("./list");

const utils = require("./utils");

/*
 * Generate an heading rule for a specific level
 */
function headingRule(n) {
    const type = MarkupIt.BLOCKS[`HEADING_${n}`];
    return HTMLRule(type, `h${n}`);
}

module.exports = [
    tableRules.block,
    tableRules.row,
    tableRules.cell,

    listRules.ul,
    listRules.ol,

    headingRule(1),
    headingRule(2),
    headingRule(3),
    headingRule(4),
    headingRule(5),
    headingRule(6),

    HTMLRule(MarkupIt.BLOCKS.HR, "hr"),
    HTMLRule(MarkupIt.BLOCKS.PARAGRAPH, "p"),
    HTMLRule(MarkupIt.BLOCKS.BLOCKQUOTE, "blockquote"),

    MarkupIt.Rule(MarkupIt.BLOCKS.FOOTNOTE).toText((state, token) => {
        const data = token.getData();
        const text = state.renderAsInline(token);
        const refname = data.get("id");

        return (
            `<blockquote id="fn_${refname}">\n` +
            `<sup>${refname}</sup>. ${text}<a href="#reffn_${refname}" title="Jump back to footnote [${refname}] in the text."> &#8617;</a>\n` +
            "</blockquote>\n"
        );
    }),

    MarkupIt.Rule(MarkupIt.BLOCKS.HTML).toText("%s\n\n"),

    MarkupIt.Rule(MarkupIt.BLOCKS.CODE).toText((state, token) => {
        let attr = "";
        const data = token.getData();
        const text = token.getAsPlainText();
        const syntax = data.get("syntax");

        if (syntax) {
            attr = ` class="lang-${syntax}"`;
        }

        return `<pre><code${attr}>${utils.escape(text)}</code></pre>\n`;
    }),
];
