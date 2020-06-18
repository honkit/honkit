const MarkupIt = require("../../");

/*
    This syntax uses the default rules (UNSTYLED)
    with a block rule to add spacing between paragraphs.
*/
module.exports = MarkupIt.Syntax("markdown", {
    inline: [],
    blocks: [MarkupIt.Rule(MarkupIt.BLOCKS.PARAGRAPH).toText("%s\n\n")],
});
