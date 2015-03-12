// Pulled from "kramed.Lexer.rules.tables"
var rules = { newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
    hr: /^( *[-*_]){3,} *(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
    nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
    lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
    blockquote: /^( *>[^\n]+(\n(?! *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$))[^\n]+)*\n*)+/,
    list: /^( *)((?:[*+-]|\d+\.)) [\s\S]+?(?:\n+(?=\1?(?:[-*_] *){3,}(?:\n+|$))|\n+(?= *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$))|\n{2,}(?! )(?!\1(?:[*+-]|\d+\.) )\n*|\s*$)/,
    html: /^ *(?:<!--[\s\S]*?--> *(?:\n|\s*$)|<((?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\b)\w+(?!:\/|[^\w\s@]*@)\b)[\s\S]+?<\/\1> *(?:\n{2,}|\s*$)|<(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\b)\w+(?!:\/|[^\w\s@]*@)\b(?:"[^"]*"|'[^']*'|[^'">])*?> *(?:\n{2,}|\s*$))/,
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
    footnote: /^\[\^([^\]]+)\]: ([^\n]+)/,
    table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/,
    paragraph: /^((?:[^\n]+\n?(?! *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\2 *(?:\n+|$)|( *)((?:[*+-]|\d+\.)) [\s\S]+?(?:\n+(?=\3?(?:[-*_] *){3,}(?:\n+|$))|\n+(?= *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$))|\n{2,}(?! )(?!\1(?:[*+-]|\d+\.) )\n*|\s*$)|( *[-*_]){3,} *(?:\n+|$)| *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)|([^\n]+)\n *(=|-){2,} *(?:\n+|$)|( *>[^\n]+(\n(?! *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$))[^\n]+)*\n*)+|<(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\b)\w+(?!:\/|[^\w\s@]*@)\b| *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)| *(\${2,}) *([\s\S]+?)\s*\1 *(?:\n+|$)))+)\n*/,
    text: /^[^\n]+/,
    math: /^ *(\${2,}) *([\s\S]+?)\s*\1 *(?:\n+|$)/,
    // These are lower level, ignore them
    //bullet: /(?:[*+-]|\d+\.)/,
    //item: /^( *)((?:[*+-]|\d+\.)) [^\n]*(?:\n(?!\1(?:[*+-]|\d+\.) )[^\n]*)*/gm,
    //_tag: '(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b'
};

// List of all the regexes we want to run
var ruleTypes = [
'newline', 'code', 'fences', 'footnote', 'math', 'heading',
'nptable', 'lheading', 'hr', 'blockquote', 'list',
'html', 'def', 'table', 'paragraph', 'text',
];

// Mapping if rule type is different from token type
var ruleMap = {
    'nptable': 'table',
    'lheading': 'heading',
    'newline': 'space',
}

function annotate(src) {
    var tokens = [];

    while(src) {
        // Pick rule
        var rule = ruleTypes.filter(function(ruleName, idx) {
            var regex = rules[ruleName];
            return regex.exec(src);
        })[0];

        // No matching rules
        if(!rule) {
            throw new Error('No rule found for: ' + src);
        }

        // Use rule to extract block
        var ruleRegex = rules[rule];
        var block = ruleRegex.exec(src);

        // Get rule type
        var type = ruleMap[rule] || rule;

        // Get raw text
        var raw = block[0];

        // Break out here to avoid infinite loops
        if(raw.length === 0) {
            break;
        }

        tokens.push({
            type: ruleMap[rule] || rule,
            raw: raw,
        });

        // Update source
        src = src.substring(raw.length);
    }

    return tokens
}

module.exports = annotate;
