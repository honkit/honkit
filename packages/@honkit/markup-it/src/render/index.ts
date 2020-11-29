import RenderingState from "./state";

/**
 * Render a Content instance using a syntax
 * @param {Content}
 * @param {Object} options
 * @return {string}
 */
function render(syntax, content, options) {
    // @ts-ignore
    const state = new RenderingState(syntax, options);
    const entryRule = syntax.getEntryRule();
    const token = content.getToken();

    return entryRule.onToken(state, token);
}

/**
 * Parse a text using a syntax as inline content
 * @param  {Syntax} syntax
 * @param  {List<Token>} tokens
 * @return {string}
 */
function renderAsInline(syntax, tokens) {
    // @ts-ignore
    const state = new RenderingState(syntax);
    return state.renderAsInline(tokens);
}

render.asInline = renderAsInline;
export default render;
