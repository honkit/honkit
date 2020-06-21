import Immutable from "immutable";

/**
 * Merge tokens of a specific type
 *
 * @param {List<Token>} tokens
 * @param {Array<String>} types
 * @return {List<Token>}
 */
function mergeTokens(tokens, types) {
    let prev;

    return tokens.reduce((output, token, i) => {
        const tokenType = token.getType();
        const isMergeable = types.indexOf(tokenType) >= 0;
        const hasNext = i + 1 < tokens.size;

        if (prev && prev.getType() === tokenType && isMergeable) {
            prev = prev.mergeWith(token);
        } else {
            output = prev ? output.push(prev) : output;
            prev = token;
        }

        if (!hasNext) {
            output = output.push(prev);
        }

        return output;
    }, Immutable.List());
}

export default mergeTokens;
