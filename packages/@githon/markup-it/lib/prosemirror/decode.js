const Immutable = require("immutable");

const Content = require("../models/content");
const Token = require("../models/token");

/**
 * Decode marks as tokens
 *
 * @param {Array} marks
 * @param {String} text
 * @return {Token}
 */
function decodeMarksAsToken(marks, text) {
    return marks.reduce((child, mark) => {
        return new Token({
            type: mark._,
            data: Immutable.Map(mark).delete("_"),
            tokens: [child],
        });
    }, Token.createText(text));
}

/**
 * Decode a token
 *
 * @paran {Object} json
 * @return {Token}
 */
function decodeTokenFromJSON(json) {
    if (json.marks) {
        return decodeMarksAsToken(json.marks, json.text);
    }

    return new Token({
        type: json.type,
        text: json.text,
        raw: json.raw,
        data: json.attrs,
        tokens: decodeTokensFromJSON(json.content || []),
    });
}

/**
 * Decode a list of tokens
 *
 * @paran {Object} json
 * @return {List<Token>}
 */
function decodeTokensFromJSON(json) {
    return new Immutable.List(json.map(decodeTokenFromJSON));
}

/**
 * Decode a JSON into a Content
 *
 * @paran {Object} json
 * @return {Content}
 */
function decodeContentFromProseMirror(json) {
    return Content.createFromToken("prosemirror", decodeTokenFromJSON(json));
}

module.exports = decodeContentFromProseMirror;
