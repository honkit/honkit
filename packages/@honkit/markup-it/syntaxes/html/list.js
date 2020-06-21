const MarkupIt = require("../../");

/**
 * Render a list item
 *
 * @param {String} text
 * @param {Token} token
 * @return {String}
 */
function renderListItem(state, token) {
    const isOrdered = token.type == MarkupIt.BLOCKS.OL_LIST;
    const listTag = isOrdered ? "ol" : "ul";
    const items = token.getTokens();

    return `<${listTag}>${items
        .map((item) => {
            return `<li>${state.render(item)}</li>`;
        })
        .join("\n")}</${listTag}>\n`;
}

const ruleOL = MarkupIt.Rule(MarkupIt.BLOCKS.OL_LIST).toText(renderListItem);

const ruleUL = MarkupIt.Rule(MarkupIt.BLOCKS.UL_LIST).toText(renderListItem);

module.exports = {
    ol: ruleOL,
    ul: ruleUL,
};
