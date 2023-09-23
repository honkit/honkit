import Immutable from "immutable";
import Token from "./token";
import BLOCKS from "../constants/blocks";

const Content: any = Immutable.Record({
    // Name of the syntax used to parse
    syntax: String(),

    // Entry token
    // @ts-ignore
    token: Token.create(BLOCKS.DOCUMENT)
});

// ---- GETTERS ----
Content.prototype.getSyntax = function () {
    return this.get("syntax");
};

Content.prototype.getToken = function () {
    return this.get("token");
};

// ---- STATICS ----

/**
 * Create a content from a syntax and a list of tokens
 *
 * @param {Syntax} syntax
 * @param {Token}
 * @return {Content}
 */
Content.createFromToken = function (syntax, token) {
    return new Content({
        syntax: syntax,
        token: token
    });
};

export default Content;
