const RenderingState = require("./state");

/**
 * Render a Content instance using a syntax
 * @param {Content}
 * @param {Object} options
 * @return {String}
 */
function render(syntax, content, options) {
    const state = new RenderingState(syntax, options);
    const entryRule = syntax.getEntryRule();
    const token = content.getToken();

    return entryRule.onToken(state, token);
}

/**
 * Parse a text using a syntax as inline content
 * @param  {Syntax} syntax
 * @param  {List<Token>} tokens
 * @return {String}
 */
function renderAsInline(syntax, tokens) {
    const state = new RenderingState(syntax);
    return state.renderAsInline(tokens);
}

module.exports = render;
module.exports.asInline = renderAsInline;
