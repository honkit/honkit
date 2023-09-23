/**
 * Encode data of a token, it ignores undefined value
 *
 * @paran {Map} data
 * @return {Object}
 */
function encodeDataToJSON(data) {
    return data
        .filter((value, key) => {
            return value !== undefined;
        })
        .toJS();
}

/**
 * Encode a token to JSON
 *
 * @paran {Token} tokens
 * @return {Object}
 */
function encodeTokenToJSON(token) {
    return {
        type: token.getType(),
        text: token.getText(),
        data: encodeDataToJSON(token.getData()),
        tokens: encodeTokensToJSON(token.getTokens())
    };
}

/**
 * Encode a list of tokens to JSON
 *
 * @paran {List<Token>} tokens
 * @return {Array}
 */
function encodeTokensToJSON(tokens) {
    return tokens.map(encodeTokenToJSON).toJS();
}

/**
 * Encode a Content into a JSON object
 *
 * @paran {Content} content
 * @return {Object}
 */
function encodeContentToJSON(content) {
    return {
        syntax: content.getSyntax(),
        token: encodeTokenToJSON(content.getToken())
    };
}

export default encodeContentToJSON;
