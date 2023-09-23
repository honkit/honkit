import Immutable from "immutable";

import Token from "../models/token";

import Content from "../models/content";

/**
 * Decode a token
 *
 * @paran {Object} json
 * @return {Token}
 */
function decodeTokenFromJSON(json) {
    // @ts-ignore
    return new Token({
        type: json.type,
        text: json.text,
        raw: json.raw,
        data: json.data,
        tokens: decodeTokensFromJSON(json.tokens || [])
    });
}

/**
 * Decode a list of tokens
 *
 * @paran {Object} json
 * @return {List<Token>}
 */
function decodeTokensFromJSON(json) {
    return Immutable.List(json.map(decodeTokenFromJSON));
}

/**
 * Decode a JSON into a Content
 *
 * @paran {Object} json
 * @return {Content}
 */
function decodeContentFromJSON(json) {
    return Content.createFromToken(json.syntax, decodeTokenFromJSON(json.token));
}

export default decodeContentFromJSON;
