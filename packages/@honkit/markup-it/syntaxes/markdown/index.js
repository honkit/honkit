const MarkupIt = require("../../");

module.exports = MarkupIt.Syntax("markdown", {
    entryRule: require("./document"),

    // List of rules for parsing blocks
    inline: require("./inline"),

    // List of rules for parsing inline styles/entities
    blocks: require("./blocks"),
});
