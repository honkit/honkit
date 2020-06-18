const Immutable = require("immutable");
const inherits = require("util").inherits;

const STYLES = require("../constants/styles");

const isBlock = require("../utils/isBlock");
const isEntity = require("../utils/isEntity");
const isStyle = require("../utils/isStyle");

const TokenRecord = Immutable.Record({
    // Type of token
    type: String(),

    // Metadata for this token
    data: new Immutable.Map(),

    // Inner text of this token (for inline tokens)
    text: null,

    // Original raw content of this token
    // Can be use for annotating
    raw: String(),

    // List of children tokens (for block tokens)
    tokens: new Immutable.List(),
});

function Token(def) {
    if (!(this instanceof Token)) {
        return new Token(def);
    }

    TokenRecord.call(this, {
        type: def.type,
        data: new Immutable.Map(def.data),
        text: def.text,
        raw: def.raw,
        tokens: new Immutable.List(def.tokens),
    });
}
inherits(Token, TokenRecord);

// ---- GETTERS ----
Token.prototype.getType = function () {
    return this.get("type");
};

Token.prototype.getData = function () {
    return this.get("data");
};

Token.prototype.getText = function () {
    return this.get("text");
};

Token.prototype.getRaw = function () {
    return this.get("raw");
};

Token.prototype.getTokens = function () {
    return this.get("tokens");
};

/**
 * Return true if is a block token
 * @return {Boolean}
 */
Token.prototype.isBlock = function () {
    return isBlock(this);
};

/**
 * Return true if is an inline token
 * @return {Boolean}
 */
Token.prototype.isInline = function () {
    return !this.isBlock();
};

/**
 * Return true if is an inline style
 * @return {Boolean}
 */
Token.prototype.isStyle = function () {
    return isStyle(this);
};

/**
 * Return true if is an inline entity
 * @return {Boolean}
 */
Token.prototype.isEntity = function () {
    return isEntity(this);
};

/**
 * Merge this token with another one
 * @param {Token} token
 * @return {Token}
 */
Token.prototype.mergeWith = function (token) {
    return this.merge({
        type: token.getType(),
        text: this.getText() + token.getText(),
        raw: this.getRaw() + token.getRaw(),
        data: this.getData().merge(token.getData()),
        tokens: this.getTokens().concat(token.getTokens()),
    });
};

/**
 * Push an inner token
 * @param {Token} token
 * @return {Token}
 */
Token.prototype.pushToken = function (token) {
    return this.merge({
        tokens: this.getTokens().push(token),
    });
};

/**
 * Update data of the token
 * @param {Object|Map}
 * @return {Token}
 */
Token.prototype.setData = function (data) {
    return this.set("data", Immutable.Map(data));
};

/**
 * Return plain text of a token merged with its children.
 * @return {String}
 */
Token.prototype.getAsPlainText = function () {
    const tokens = this.getTokens();

    if (tokens.size === 0) {
        return this.getText() || "";
    }

    return tokens.reduce((text, tok) => {
        return text + tok.getAsPlainText();
    }, "");
};

// ---- STATICS ----

/**
 * Create a token
 * @param {Object} tok
 * @return {Token}
 */
Token.create = function (type, tok) {
    tok = tok || {};

    let text = tok.text || "";
    const tokens = Immutable.List(tok.tokens || []);
    const data = Immutable.Map(tok.data || {});

    if (tokens.size > 0) {
        text = undefined;
    }

    return new Token({
        type: type,
        text: text,
        raw: tok.raw || "",
        tokens: tokens,
        data: data,
    });
};

/**
 * Create a token for an inline text
 * @param {String} text
 * @return {Token}
 */
Token.createText = function (text) {
    return Token.create(STYLES.TEXT, {
        text: text,
        raw: text,
    });
};

module.exports = Token;
