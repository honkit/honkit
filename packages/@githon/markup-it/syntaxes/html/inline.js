const markup = require("../../");
const utils = require("./utils");

const HTMLRule = require("./rule");

module.exports = [
    // ---- TEXT ----
    markup.Rule(markup.STYLES.TEXT).toText((state, token) => {
        return utils.escape(token.getAsPlainText());
    }),

    // ---- CODE ----
    markup.Rule(markup.STYLES.CODE).toText((state, token) => {
        return `<code>${utils.escape(token.getAsPlainText())}</code>`;
    }),

    // ---- BOLD ----
    HTMLRule(markup.STYLES.BOLD, "strong"),

    // ---- ITALIC ----
    HTMLRule(markup.STYLES.ITALIC, "em"),

    // ---- STRIKETHROUGH ----
    HTMLRule(markup.STYLES.STRIKETHROUGH, "del"),

    // ---- IMAGES ----
    HTMLRule(markup.ENTITIES.IMAGE, "img"),

    // ---- LINK ----
    HTMLRule(markup.ENTITIES.LINK, "a", (data) => {
        return {
            title: data.title ? utils.escape(data.title) : undefined,
            href: utils.escape(data.href || ""),
        };
    }),

    // ---- FOOTNOTE ----
    markup.Rule(markup.ENTITIES.FOOTNOTE_REF).toText((state, token) => {
        const refname = token.getAsPlainText();
        return `<sup><a href="#fn_${refname}" id="reffn_${refname}">${refname}</a></sup>`;
    }),

    // ---- HTML ----
    markup.Rule(markup.STYLES.HTML).toText((state, token) => {
        return token.getAsPlainText();
    }),
];
