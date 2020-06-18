const reBlock = require("./re/block");
const MarkupIt = require("../../");
const utils = require("./utils");

// Rule for parsing code blocks
const blockRule = MarkupIt.Rule(MarkupIt.BLOCKS.CODE)
    // Fences
    .regExp(reBlock.fences, (state, match) => {
        const inner = match[3];

        return {
            tokens: [MarkupIt.Token.createText(inner)],
            data: {
                syntax: match[2],
            },
        };
    })

    // 4 spaces / Tab
    .regExp(reBlock.code, (state, match) => {
        let inner = match[0];

        // Remove indentation
        inner = inner.replace(/^( {4}|\t)/gm, "");

        // No pedantic mode
        inner = inner.replace(/\n+$/, "");

        return {
            tokens: [MarkupIt.Token.createText(inner)],
            data: {
                syntax: undefined,
            },
        };
    })

    // Output code blocks
    .toText((state, token) => {
        const text = token.getAsPlainText();
        const data = token.getData();
        const syntax = data.get("syntax") || "";
        const hasFences = text.indexOf("`") >= 0;

        // Use fences if syntax is set
        if (!hasFences || syntax) {
            return `\`\`\`${syntax}\n${text}\n` + "```\n\n";
        }

        // Use four spaces otherwise
        const lines = utils.splitLines(text);

        return `${lines
            .map((line) => {
                if (!line.trim()) return "";
                return `    ${line}`;
            })
            .join("\n")}\n\n`;
    });

module.exports = {
    block: blockRule,
};
