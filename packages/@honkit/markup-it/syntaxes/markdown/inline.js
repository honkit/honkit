const Immutable = require("immutable");

const reInline = require("./re/inline");
const MarkupIt = require("../../");

const utils = require("./utils");
const isHTMLBlock = require("./isHTMLBlock");
const math = require("./math");

const inlineRules = MarkupIt.RulesSet([
    // ---- FOOTNOTE REFS ----
    MarkupIt.Rule(MarkupIt.ENTITIES.FOOTNOTE_REF)
        .regExp(reInline.reffn, (state, match) => {
            return {
                text: match[1],
            };
        })
        .toText((state, token) => {
            return `[^${token.getAsPlainText()}]`;
        }),

    // ---- IMAGES ----
    MarkupIt.Rule(MarkupIt.ENTITIES.IMAGE)
        .regExp(reInline.link, (state, match) => {
            const isImage = match[0].charAt(0) === "!";
            if (!isImage) {
                return;
            }

            const imgData = {
                alt: match[1],
                src: match[2],
            };

            const title = match[3];
            if (typeof title !== "undefined" && title !== "") {
                imgData.title = title;
            }

            return {
                data: imgData,
            };
        })
        .toText((state, token) => {
            const data = token.getData();
            const alt = data.get("alt", "");
            const src = data.get("src", "");
            const title = data.get("title", "");
            if (title !== "") {
                return `![${alt}](${src} "${title}")`;
            } else {
                return `![${alt}](${src})`;
            }
        }),

    // ---- LINK ----
    MarkupIt.Rule(MarkupIt.ENTITIES.LINK)
        .regExp(reInline.link, (state, match) => {
            return state.toggle("link", () => {
                return {
                    tokens: state.parseAsInline(match[1]),
                    data: {
                        href: match[2],
                        title: match[3],
                    },
                };
            });
        })
        .regExp(reInline.autolink, (state, match) => {
            return state.toggle("link", () => {
                return {
                    tokens: state.parseAsInline(match[1]),
                    data: {
                        href: match[1],
                    },
                };
            });
        })
        .regExp(reInline.url, (state, match, parents) => {
            if (state.get("link")) {
                return;
            }
            const uri = match[1];

            return {
                data: {
                    href: uri,
                },
                tokens: [MarkupIt.Token.createText(uri)],
            };
        })
        .regExp(reInline.reflink, (state, match) => {
            const refId = match[2] || match[1];
            const innerText = match[1];

            return state.toggle("link", () => {
                return {
                    type: MarkupIt.ENTITIES.LINK,
                    data: {
                        ref: refId,
                    },
                    tokens: [MarkupIt.Token.createText(innerText)],
                };
            });
        })
        .regExp(reInline.nolink, (state, match) => {
            const refId = match[2] || match[1];

            return state.toggle("link", () => {
                return {
                    type: MarkupIt.ENTITIES.LINK,
                    tokens: state.parseAsInline(match[1]),
                    data: {
                        ref: refId,
                    },
                };
            });
        })
        .regExp(reInline.reffn, (state, match) => {
            const refId = match[1];

            return state.toggle("link", () => {
                return {
                    tokens: state.parseAsInline(match[1]),
                    data: {
                        ref: refId,
                    },
                };
            });
        })
        .toText((state, token) => {
            const data = token.getData();
            let title = data.get("title");
            const href = data.get("href");
            const innerContent = state.renderAsInline(token);
            title = title ? ` "${title}"` : "";

            return `[${innerContent}](${href}${title})`;
        }),

    // ---- CODE ----
    MarkupIt.Rule(MarkupIt.STYLES.CODE)
        .regExp(reInline.code, (state, match) => {
            return {
                tokens: [MarkupIt.Token.createText(match[2])],
            };
        })
        .toText((state, token) => {
            let separator = "`";
            const text = token.getAsPlainText();

            // We need to find the right separator not present in the content
            while (text.indexOf(separator) >= 0) {
                separator += "`";
            }

            return separator + text + separator;
        }),

    // ---- BOLD ----
    MarkupIt.Rule(MarkupIt.STYLES.BOLD)
        .regExp(reInline.strong, (state, match) => {
            return {
                tokens: state.parseAsInline(match[2] || match[1]),
            };
        })
        .toText("**%s**"),

    // ---- ITALIC ----
    MarkupIt.Rule(MarkupIt.STYLES.ITALIC)
        .regExp(reInline.em, (state, match) => {
            return {
                tokens: state.parseAsInline(match[2] || match[1]),
            };
        })
        .toText("_%s_"),

    // ---- STRIKETHROUGH ----
    MarkupIt.Rule(MarkupIt.STYLES.STRIKETHROUGH)
        .regExp(reInline.del, (state, match) => {
            return {
                tokens: state.parseAsInline(match[1]),
            };
        })
        .toText("~~%s~~"),

    // ---- HTML ----
    MarkupIt.Rule(MarkupIt.STYLES.HTML)
        .regExp(reInline.html, (state, match) => {
            const tag = match[0];
            const tagName = match[1];
            const innerText = match[2] || "";
            let startTag, endTag;
            let innerTokens = [];

            if (innerText) {
                startTag = tag.substring(0, tag.indexOf(innerText));
                endTag = tag.substring(tag.indexOf(innerText) + innerText.length);
            } else {
                startTag = match[0];
                endTag = "";
            }

            if (tagName && !isHTMLBlock(tagName) && innerText) {
                const isLink = tagName.toLowerCase() === "a";

                innerTokens = state.toggle(isLink ? "link" : "html", () => {
                    return state.parseAsInline(innerText);
                });
            } else {
                innerTokens = [
                    {
                        type: MarkupIt.STYLES.HTML,
                        text: innerText,
                        raw: innerText,
                    },
                ];
            }

            let result = Immutable.List().push({
                type: MarkupIt.STYLES.HTML,
                text: startTag,
                raw: startTag,
            });

            result = result.concat(innerTokens);

            if (endTag) {
                result = result.push({
                    type: MarkupIt.STYLES.HTML,
                    text: endTag,
                    raw: endTag,
                });
            }

            return result;
        })
        .toText((state, token) => {
            return token.getAsPlainText();
        }),

    // ---- MATH ----
    math,

    MarkupIt.Rule(MarkupIt.ENTITIES.TEMPLATE)
        .regExp(reInline.template, (state, match) => {
            if (state.getOption("template") !== true) {
                return;
            }

            let type = match[1];
            const text = match[2];

            if (type == "%") type = "expr";
            else if (type == "#") type = "comment";
            else if (type == "{") type = "var";

            return {
                text: "",
                data: {
                    type: type,
                },
                tokens: [MarkupIt.Token.createText(text)],
            };
        })
        .toText((state, token) => {
            const data = token.getData();
            let text = token.getAsPlainText();
            const type = data.get("type");

            if (type == "expr") text = `{% ${text} %}`;
            else if (type == "comment") text = `{# ${text} #}`;
            else if (type == "var") text = `{{ ${text} }}`;

            return text;
        }),

    // ---- ESCAPED ----
    MarkupIt.Rule(MarkupIt.STYLES.TEXT)
        .regExp(reInline.escape, (state, match) => {
            return {
                text: match[1],
            };
        })
        .regExp(reInline.text, (state, match) => {
            return {
                text: utils.unescape(match[0]),
            };
        })
        .toText((state, token) => {
            const text = token.getAsPlainText();
            return utils.escape(text, false);
        }),
]);

module.exports = inlineRules;
