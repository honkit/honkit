const replace = require("../utils").replace;

const inline = {
    escape: /^\\([\\`*{}[\]()#$+\-.!_>|])/,
    autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
    url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
    html: /^<!--[\s\S]*?-->|^<(\w+(?!:\/|[^\w\s@]*@)\b)*?(?:"[^"]*"|'[^']*'|[^'">])*?>([\s\S]*?)?<\/\1>|^<(\w+(?!:\/|[^\w\s@]*@)\b)(?:"[^"]*"|'[^']*'|[^'">])*?>/,
    link: /^!?\[(inside)]\(href\)/,
    reflink: /^!?\[(inside)]\s*\[([^\]]*)]/,
    nolink: /^!?\[((?:\[[^\]]*]|[^[\]])*)]/,
    reffn: /^!?\[\^(inside)]/,
    strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
    em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
    code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
    br: /^ {2,}\n(?!\s*$)/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    text: /^[\s\S]+?(?=[\\<![_*`$]| {2,}\n|$)/,
    math: /^\$\$([^$]+)\$\$/,
    template: /^{([#%{])\s*(.*?)\s*(?=[#%}]})[#%}]}/,
};

inline._inside = /(?:\[[^\]]*]|[^[\]]|](?=[^[]*]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)("inside", inline._inside)("href", inline._href)();

inline.reflink = replace(inline.reflink)("inside", inline._inside)();

inline.reffn = replace(inline.reffn)("inside", inline._inside)();

// Update RegExp for text/escape to stop at strikethrough
inline.text = replace(inline.text)("]|", "~]|")("|", "|https?://|")("~]|", `~]|${inline.template.source}|`)();
inline.escape = replace(inline.escape)("])", "~|])")();

module.exports = inline;
