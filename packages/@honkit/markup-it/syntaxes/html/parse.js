const Immutable = require("immutable");
const htmlparser = require("htmlparser2");
const MarkupIt = require("../../");

const TAGS_TO_TYPE = {
    a: MarkupIt.ENTITIES.LINK,
    img: MarkupIt.ENTITIES.IMAGE,

    h1: MarkupIt.BLOCKS.HEADING_1,
    h2: MarkupIt.BLOCKS.HEADING_2,
    h3: MarkupIt.BLOCKS.HEADING_3,
    h4: MarkupIt.BLOCKS.HEADING_4,
    h5: MarkupIt.BLOCKS.HEADING_5,
    h6: MarkupIt.BLOCKS.HEADING_6,
    pre: MarkupIt.BLOCKS.CODE,
    blockquote: MarkupIt.BLOCKS.BLOCKQUOTE,
    p: MarkupIt.BLOCKS.PARAGRAPH,
    hr: MarkupIt.BLOCKS.HR,

    table: MarkupIt.BLOCKS.TABLE,
    tr: MarkupIt.BLOCKS.TABLE_ROW,
    td: MarkupIt.BLOCKS.TABLE_CELL,

    ul: MarkupIt.BLOCKS.UL_LIST,
    ol: MarkupIt.BLOCKS.OL_LIST,
    li: MarkupIt.BLOCKS.LIST_ITEM,

    b: MarkupIt.STYLES.BOLD,
    strike: MarkupIt.STYLES.STRIKETHROUGH,
    em: MarkupIt.STYLES.ITALIC,
    code: MarkupIt.STYLES.CODE,
};

function resolveHeadingAttrs(attribs) {
    return {
        id: attribs.id,
    };
}

const TAGS_TO_DATA = {
    a: function (attribs) {
        return {
            href: attribs.href,
            title: attribs.alt || "",
        };
    },
    img: function (attribs) {
        return {
            src: attribs.src,
            title: attribs.alt || "",
        };
    },
    h1: resolveHeadingAttrs,
    h2: resolveHeadingAttrs,
    h3: resolveHeadingAttrs,
    h4: resolveHeadingAttrs,
    h5: resolveHeadingAttrs,
    h6: resolveHeadingAttrs,
};

/**
 * Parse an HTML string into a token tree
 * @param {String} str
 * @return {List<Token>}
 */
function htmlToTokens(str) {
    const result = [];
    const stack = [];

    function pushToLast(tok) {
        if (stack.length > 0) {
            stack[stack.length - 1] = stack[stack.length - 1].pushToken(tok);
        } else {
            result.push(tok);
        }
    }

    const parser = new htmlparser.Parser(
        {
            onopentag: function (tagName, attribs) {
                const type = TAGS_TO_TYPE[tagName];
                const dataResolver = TAGS_TO_DATA[tagName];

                if (!type) {
                    return;
                }

                const token = MarkupIt.Token.create(type, {
                    data: dataResolver ? dataResolver(attribs) : {},
                });

                stack.push(token);
            },
            ontext: function (text) {
                if (!text.trim()) {
                    return;
                }

                const textNode = MarkupIt.Token.createText(text);
                pushToLast(textNode);
            },
            onclosetag: function (tagName) {
                const type = TAGS_TO_TYPE[tagName];
                if (!type) {
                    return;
                }

                const lastToken = stack.pop();
                pushToLast(lastToken);
            },
        },
        {
            decodeEntities: true,
        }
    );

    parser.write(str);
    parser.end();

    return Immutable.List(result);
}

module.exports = htmlToTokens;
