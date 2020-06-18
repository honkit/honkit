const ltrim = require("ltrim");
const rtrim = require("rtrim");

const reInline = require("./re/inline");
const MarkupIt = require("../../");

/**
 * Return true if a tex content is inline
 */
function isInlineTex(content) {
    return content[0] !== "\n";
}

/**
 * Normalize some TeX content
 * @param {String} content
 * @param {Boolean} isInline
 * @return {String}
 */
function normalizeTeX(content, isInline) {
    content = ltrim(content, "\n");
    content = rtrim(content, "\n");

    if (!isInline) {
        content = `\n${content}\n`;
    }

    return content;
}

module.exports = MarkupIt.Rule(MarkupIt.ENTITIES.MATH)
    .regExp(reInline.math, (state, match) => {
        const text = match[1];

        if (state.getOption("math") !== true || text.trim().length === 0) {
            return;
        }

        return {
            data: {
                tex: text,
            },
        };
    })
    .toText((state, token) => {
        const data = token.getData();
        let tex = data.get("tex");
        const isInline = isInlineTex(tex);

        tex = normalizeTeX(tex, isInline);

        let output = `$$${tex}$$`;

        if (!isInline) {
            output = `\n${output}\n`;
        }

        return output;
    });
