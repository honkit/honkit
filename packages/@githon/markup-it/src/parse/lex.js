const Immutable = require("immutable");

const textToUnstyledTokens = require("./textToUnstyledTokens");
const matchRule = require("./matchRule");

/**
 * Process a text using a set of rules
 * to return a flat list of tokens
 *
 * @param {ParsingState} state
 * @param {List<Rule>} rules
 * @param {Boolean} isInline
 * @param {String} text
 * @return {List<Token>}
 */
function lex(state, rules, isInline, text, nonParsed) {
    let tokens = Immutable.List();
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
        .concat(lex(state, rules, isInline, newText));

    return tokens;
}

module.exports = lex;
