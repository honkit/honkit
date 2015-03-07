var _ = require('lodash');
var kramed = require('kramed');
var hljs = require('highlight.js');

var lnormalize = require('./utils/lang').normalize;

var RAW_START = "{% raw %}";
var RAW_END = "{% endraw %}";
var CODEBLOCKS = {
    md: /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/,
    fences: /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm
};

function preparePage(src) {
    // GFM Fences
    src = src.replace(CODEBLOCKS.fences, function(wholeMatch, m1, m2, m3, m4) {
        wholeMatch = wholeMatch.slice(m1.length);
        return m1+RAW_START+wholeMatch+RAW_END;
    });

    // Normal codeblocks
    src += "~0";
    src = src.replace(CODEBLOCKS.md, function(all, m1, m2) {
        all = all.slice(0, -m2.length);
        return RAW_START+all+RAW_END+m2;
    });
    src = src.replace(/~0/, "");

    return src;
}

function parsePage(src) {
    var options = _.extend({}, kramed.defaults, {
        // Synchronous highlighting with highlight.js
        highlight: function (code, lang) {
            if(!lang || !hljs) return code;

            // Normalize lang
            lang = lnormalize(lang);

            try {
                return hljs.highlight(lang, code).value;
            } catch(e) { }

            return code;
        }
    });

    return {
        sections: [
            {
                type: "normal",
                content: kramed(src, options)
            }
        ]
    };
}

// Exports
module.exports = parsePage;
module.exports.prepare = preparePage;
