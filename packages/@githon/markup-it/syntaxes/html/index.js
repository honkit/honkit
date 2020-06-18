const MarkupIt = require("../../");
const htmlToTokens = require("./parse");

const documentRule = MarkupIt.Rule(MarkupIt.BLOCKS.DOCUMENT)
    .match((state, text) => {
        return {
            tokens: htmlToTokens(text),
        };
    })
    .toText((state, token) => {
        return state.renderAsBlock(token);
    });

module.exports = MarkupIt.Syntax("html", {
    entryRule: documentRule,

    // List of rules for parsing blocks
    inline: require("./inline"),

    // List of rules for parsing inline styles/entities
    blocks: require("./blocks"),
});
