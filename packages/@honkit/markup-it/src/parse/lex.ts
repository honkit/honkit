import Immutable from "immutable";

import textToUnstyledTokens from "./textToUnstyledTokens";
import matchRule from "./matchRule";

/**
 * Process a text using a set of rules
 * to return a flat list of tokens
 *
 * @param {ParsingState} state
 * @param {List<Rule>} rules
 * @param {boolean} isInline
 * @param {string} text
 * @return {List<Token>}
 */
function lex(state, rules, isInline, text, nonParsed) {
    let tokens: any = Immutable.List();
    let matchedTokens;

    nonParsed = nonParsed || "";

    if (!text) {
        return tokens.concat(textToUnstyledTokens(state, isInline, nonParsed));
    }

    rules.forEach((rule) => {
        matchedTokens = matchRule(state, rule, text);
        if (!matchedTokens) {
            return;
        }

        return false;
    });

    if (!matchedTokens) {
        nonParsed += text[0];
        text = text.substring(1);

        return lex(state, rules, isInline, text, nonParsed);
    }

    const newText = matchedTokens.reduce((result, token) => {
        return result.substring(token.getRaw().length);
    }, text);

    // Keep parsing
    tokens = textToUnstyledTokens(state, isInline, nonParsed)
        .concat(matchedTokens)
        // @ts-ignore
        .concat(lex(state, rules, isInline, newText));

    return tokens;
}

export default lex;
