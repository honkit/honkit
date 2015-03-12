var engine = require('./annotate_engine');

// Pulled from "kramed.InlineLexer.rules.gfm"
var rules = {
    escape: /^\\([\\`*{}\[\]()#$+\-.!_>~|])/,
    autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
    url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
    tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
    link: /^!?\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/,
    reflink: /^!?\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\s*\[([^\]]*)\]/,
    nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
    reffn: /^!?\[\^((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]/,
    strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
    em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
    code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
    br: /^ {2,}\n(?!\s*$)/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    text: /^[\s\S]+?(?=[\\<!\[_*`$~]|https?:\/\/| {2,}\n|$)/,
    math: /^\$\$\s*([\s\S]*?[^\$])\s*\$\$(?!\$)/,
    //_inside: /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,
    //_href: /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/
};

// List of all the regexes we want to run
var ruleTypes = [
'escape', 'autolink', 'url', 'tag', 'link', 'reflink',
'nolink', 'reffn', 'strong', 'em', 'code', 'br',
'del', 'text', 'math'
];

// Mapping if rule type is different from token type
var ruleMap = {

};

function annotate(src) {
    return engine(src, rules, ruleTypes, ruleMap);
}

module.exports = annotate;
