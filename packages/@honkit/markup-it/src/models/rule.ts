import Immutable from "immutable";
import is from "is";
import Token from "./token";

const inherits = require("util").inherits;
const RuleRecord = Immutable.Record({
    // Type of the rule
    type: new String(),

    // Listener / Handlers {Map(<String,List<Function>)}
    listeners: Immutable.Map()
});

function Rule(type?) {
    if (!(this instanceof Rule)) {
        // @ts-expect-error
        return new Rule(type);
    }

    RuleRecord.call(this, {
        type: type
    });
}
inherits(Rule, RuleRecord);

// ---- GETTERS ----

Rule.prototype.getType = function () {
    return this.get("type");
};

Rule.prototype.getListeners = function () {
    return this.get("listeners");
};

// ---- METHODS ----

/**
 * Add a listener
 * @param {string} key
 * @param {Function} fn
 * @return {Rule}
 */
Rule.prototype.on = function (key, fn) {
    let listeners = this.getListeners();

    // Add the function to the list
    let fns = listeners.get(key) || Immutable.List();
    fns = fns.push(fn);

    listeners = listeners.set(key, fns);

    return this.set("listeners", listeners);
};

/**
 * Add a template or function to render a token
 * @param {String|Function} fn
 * @return {Rule}
 */
Rule.prototype.toText = function (fn) {
    if (is.string(fn)) {
        const tpl = fn;
        fn = function (state, token) {
            return tpl.replace("%s", () => {
                return state.render(token);
            });
        };
    }

    return this.on("text", fn);
};

/**
 * Add a match callback
 * @param {Function} fn
 * @return {Rule}
 */
Rule.prototype.match = function (fn) {
    return this.on("match", fn);
};

/**
 * Add a match callback using a RegExp
 * @param {RegExp} re
 * @param {Funciton} propsFn
 * @return {Rule}
 */
Rule.prototype.regExp = function (re, propsFn) {
    return this.match((state, text) => {
        let block: any = {};

        const match = re.exec(text);
        if (!match) {
            return null;
        }
        if (propsFn) {
            block = propsFn.call(null, state, match);
        }

        if (!block) {
            return null;
        } else if (block instanceof Token) {
            return block;
        } else if (is.array(block)) {
            return block;
        }

        block.raw = is.undefined(block.raw) ? match[0] : block.raw;

        return block;
    });
};

/**
 * Call listerners with a specific set of data
 * @param {string} key
 * @return {Mixed}
 */
Rule.prototype.emit = function (key) {
    const args = Array.prototype.slice.call(arguments, 1);
    const listeners = this.getListeners();

    // Add the function to the list
    const fns = listeners.get(key) || Immutable.List();

    return fns.reduce((result, fn) => {
        if (result) return result;

        return fn.apply(null, args);
    }, null);
};

/**
 * Parse a text using matching rules and return a list of tokens
 * @param  {ParsingState} state
 * @param  {string} text
 * @return {List<Token>}
 */
Rule.prototype.onText = function (state, text) {
    return this.emit("match", state, text);
};

/**
 * Render a token as a string
 * @param  {RenderingState} state
 * @param  {Token} token
 * @return {string}
 */
Rule.prototype.onToken = function (state, text) {
    return this.emit("text", state, text);
};

export default Rule;
