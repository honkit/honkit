import Content from "../models/content";
import ParsingState from "./state";
import matchRule from "./matchRule";

/**
 * Parse a text using a syntax
 * @param  {Syntax} syntax
 * @param  {string} text
 * @return {Content}
 */
function parse(syntax, text, options?: {}) {
    const entryRule = syntax.getEntryRule();
    // @ts-ignore
    const state = new ParsingState(syntax, options);
    const tokens = matchRule(state, entryRule, text);

    return Content.createFromToken(syntax.getName(), tokens.first());
}

/**
 * Parse a text using a syntax as inline content
 * @param  {Syntax} syntax
 * @param  {string} text
 * @return {List<Token>}
 */
function parseAsInline(syntax, text, options?: {}) {
    // @ts-ignore
    const state = new ParsingState(syntax, options);
    return state.parseAsInline(text);
}

export default parse;
parse.asInline = parseAsInline;
