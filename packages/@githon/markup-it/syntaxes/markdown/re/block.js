const replace = require("../utils").replace;
const heading = require("./heading");

const block = {
    newline: /^\n+/,
    code: /^((?: {4}|\t)[^\n]+\n*)+/,
    hr: /^( *[-*_]){3,} *(?:\n|$)/,
    blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
    html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n|$)/,
    footnote: /^\[\^([^\]]+)\]: ([^\n]+)/,
    paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def|math))+)\n*/,
    text: /^[^\n]+/,
    fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?[\s]*)\n *\1 *(?:\n|$)/,
    yamlHeader: /^ *(?=```)/,
    math: /^ *(\${2,}) *([\s\S]+?)\s*\1 *(?:\n|$)/,
    list: {
        block: /^( *)(bullet) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1allbull )\n*|\s*$)/,
        item: /^( *)(bullet) [^\n]*(?:\n(?!\1allbull )[^\n]*)*/,
        bullet: /(?:[*+-]|\d+\.)/,
        bullet_ul: /(?:\d+\.)/,
        bullet_ol: /(?:[*+-])/,

        bulletAndSpaces: /^ *([*+-]|\d+\.) +/,
    },
};

const _tag =
    "(?!(?:" +
    "a|em|strong|small|s|cite|q|dfn|abbr|data|time|code" +
    "|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo" +
    "|span|br|wbr|ins|del|img)\\b)\\w+(?!:\\/|[^\\w\\s@]*@)\\b";

block.list.item = replace(block.list.item, "gm")(/allbull/g, block.list.bullet)(/bullet/g, block.list.bullet)();

block.blockquote = replace(block.blockquote)("def", block.def)();

block.list.block = replace(block.list.block)(/allbull/g, block.list.bullet)(
    "hr",
    "\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))"
)("def", `\\n+(?=${block.def.source})`)("footnote", block.footnote)();

block.list.block_ul = replace(block.list.block)(/bullet/g, block.list.bullet_ul)();
block.list.block_ol = replace(block.list.block)(/bullet/g, block.list.bullet_ol)();
block.list.block = replace(block.list.block)(/bullet/g, block.list.bullet)();

block.html = replace(block.html)("comment", /<!--[\s\S]*?-->/)("closed", /<(tag)[\s\S]+?<\/\1>/)(
    "closing",
    /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/
)(/tag/g, _tag)();

block.paragraph = replace(block.paragraph)("hr", block.hr)("heading", heading.normal)("lheading", heading.line)(
    "blockquote",
    block.blockquote
)("tag", `<${_tag}`)("def", block.def)("math", block.math)();

block.paragraph = replace(block.paragraph)(
    "(?!",
    `(?!${block.fences.source.replace("\\1", "\\2")}|${block.list.block_ol.source.replace("\\1", "\\3")}|`
)();

module.exports = block;
