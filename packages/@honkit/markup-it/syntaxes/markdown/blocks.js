const reBlock = require("./re/block");
const MarkupIt = require("../../");

const heading = require("./heading");
const list = require("./list");
const code = require("./code");
const table = require("./table");
const utils = require("./utils");

module.exports = MarkupIt.RulesSet([
    // ---- CODE BLOCKS ----
    code.block,

    // ---- FOOTNOTES ----
    MarkupIt.Rule(MarkupIt.BLOCKS.FOOTNOTE)
        .regExp(reBlock.footnote, (state, match) => {
            const text = match[2];

            return {
                tokens: state.parseAsInline(text),
                data: {
                    id: match[1],
                },
            };
        })
        .toText((state, token) => {
            const data = token.getData();
            const id = data.get("id");
            const innerContent = state.renderAsInline(token);

            return `[^${id}]: ${innerContent}\n\n`;
        }),

    // ---- HEADING ----
    heading(6),
    heading(5),
    heading(4),
    heading(3),
    heading(2),
    heading(1),

    // ---- TABLE ----
    table.block,
    table.row,
    table.cell,

    // ---- HR ----
    MarkupIt.Rule(MarkupIt.BLOCKS.HR)
        .regExp(reBlock.hr, () => {
            return {};
        })
        .toText("---\n\n"),

    // ---- BLOCKQUOTE ----
    MarkupIt.Rule(MarkupIt.BLOCKS.BLOCKQUOTE)
        .regExp(reBlock.blockquote, (state, match) => {
            const inner = match[0].replace(/^ *> ?/gm, "").trim();

            return state.toggle("blockquote", () => {
                return {
                    tokens: state.parseAsBlock(inner),
                };
            });
        })

        .toText((state, token) => {
            const innerContent = state.renderAsBlock(token);
            const lines = utils.splitLines(innerContent.trim());

            return `${lines
                .map((line) => {
                    return `> ${line}`;
                })
                .join("\n")}\n\n`;
        }),

    // ---- LISTS ----
    list.ul,
    list.ol,

    // ---- HTML ----
    MarkupIt.Rule(MarkupIt.BLOCKS.HTML)
        .regExp(reBlock.html, (state, match) => {
            return {
                text: match[0],
            };
        })
        .toText("%s"),

    // ---- DEFINITION ----
    MarkupIt.Rule().regExp(reBlock.def, (state, match) => {
        if (state.getDepth() > 1) {
            return;
        }

        const id = match[1].toLowerCase();
        const href = match[2];
        const title = match[3];

        state.refs = state.refs || {};
        state.refs[id] = {
            href: href,
            title: title,
        };

        return {
            type: "definition",
        };
    }),

    // ---- PARAGRAPH ----
    MarkupIt.Rule(MarkupIt.BLOCKS.PARAGRAPH)
        .regExp(reBlock.math, (state, match) => {
            const text = match[2];

            if (state.getOption("math") !== true || text.trim().length === 0) {
                return;
            }

            return {
                tokens: [
                    MarkupIt.Token.create(MarkupIt.ENTITIES.MATH, {
                        data: {
                            tex: text,
                        },
                    }),
                ],
            };
        })
        .regExp(reBlock.paragraph, (state, match) => {
            const isInBlockquote = state.get("blockquote") === state.getParentDepth();
            const isInLooseList = state.get("looseList") === state.getParentDepth();
            const isTop = state.getDepth() === 1;

            if (!isTop && !isInBlockquote && !isInLooseList) {
                return;
            }
            const text = match[1].trim();

            return {
                tokens: state.parseAsInline(text),
            };
        })
        .toText("%s\n\n"),

    // ---- TEXT ----
    // Top-level should never reach here.
    MarkupIt.Rule(MarkupIt.BLOCKS.TEXT)
        .regExp(reBlock.text, (state, match) => {
            const text = match[0];

            return {
                tokens: state.parseAsInline(text),
            };
        })
        .toText("%s\n"),
]);
