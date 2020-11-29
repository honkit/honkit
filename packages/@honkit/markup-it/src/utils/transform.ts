import Immutable from "immutable";
import Content from "../models/content";

/**
 * Walk throught the children tokens tree, and
 * map each token using a transformation
 *
 * The transformation iterator can return a list, a new token or undefined.
 *
 * @param {Token|Content} base
 * @param {Function(token, depth)} iter
 * @param {number} depth
 * @return {Token}
 */
function transformToken(base, iter, depth = 0) {
    const tokens = base.getTokens();
    const newTokens = transformTokens(tokens, iter);
    base = base.set("tokens", newTokens);

    return base instanceof Content ? base : iter(base, depth);
}

/**
 * Transform a list of tokens
 * @param {List<Token>} tokens
 * @param {Function} iter
 * @param {number} depth
 * @return {List<Token>}
 */
function transformTokens(tokens, iter) {
    return tokens.reduce((list, token) => {
        const result = transform(token, iter);

        if (Immutable.List.isList(result)) {
            return list.concat(result);
        } else if (result) {
            return list.push(result);
        }

        return list;
    }, Immutable.List());
}

/**
 * Transform that works on token or list of tokens
 * @param  {Token|List<Token>|Content} base
 * @param  {Function} iter
 * @return {Token|List<Token>|Content}
 */
function transform(base, iter) {
    if (Immutable.List.isList(base)) {
        return transformTokens(base, iter);
    } else {
        return transformToken(base, iter);
    }
}

export default transform;
