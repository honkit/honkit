const Immutable = require("immutable");

const STYLES = require("../constants/styles");
const lex = require("./lex");
const mergeTokens = require("./mergeTokens");

function ParsingState(syntax, options) {
    if (!(this instanceof ParsingState)) {
        return new ParsingState(syntax);
    }

    this._ = {};
    this.depth = 0;
    this.syntax = syntax;
    this.options = Immutable.Map(options || {});
}

/**
 * Get an option value
 * @param {String} key
 * @return {Mixed}
 */
ParsingState.prototype.getOption = function (key) {
    return this.options.get(key);
};

/**
 * Get depth of parsing
 * @return {Number}
 */
ParsingState.prototype.getDepth = function () {
    return this.depth;
};

/**
 * Get depth of parent token
 * @return {Number}
 */
ParsingState.prototype.getParentDepth = function () {
    return this.getDepth() - 1;
};

/**
 * Get a state
 * @param {String} key
 * @return {Mixed}
 */
ParsingState.prototype.get = function (key) {
    return this._[key];
};

/**
 * Get a state
 * @param {String} key
 * @param {Mixed} value
 * @return {Mixed}
 */
ParsingState.prototype.set = function (key, value) {
    this._[key] = value;
    return this;
};

/**
 * Toggle a state and execute the function
 * @param {String} key
 * @param {[type]} [varname] [description]
 * @return {Mixed}
 */
ParsingState.prototype.toggle = function (key, value, fn) {
    if (!fn) {
        fn = value;
        value = this.depth;
    }

    const prevValue = this.get(key);

    this._[key] = value;
    const result = fn();
    this._[key] = prevValue;

    return result;
};

/**
 * Parse a text using a set of rules
 * @param {RulesSet} rules
 * @param {Boolean} isInline
 * @param {String} text
 * @return {List<Token>}
 */
ParsingState.prototype.parse = function (rulesSet, isInline, text) {
    this.depth++;

    const rules = rulesSet.getRules();
    let tokens = lex(this, rules, isInline, text);

    if (isInline) {
        tokens = mergeTokens(tokens, [STYLES.TEXT]);
    }

    this.depth--;

    return tokens;
};

/**
 * Parse a text using inline rules
 * @param {String} text
 * @return {List<Token>}
 */
ParsingState.prototype.parseAsInline = function (text) {
    return this.parse(this.syntax.getInlineRulesSet(), true, text);
};

/**
 * Parse a text using inline rules
 * @param {String} text
 * @return {List<Token>}
 */
ParsingState.prototype.parseAsBlock = function (text) {
    return this.parse(this.syntax.getBlockRulesSet(), false, text);
};

module.exports = ParsingState;
