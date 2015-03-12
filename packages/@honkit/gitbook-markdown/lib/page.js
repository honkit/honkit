var _ = require('lodash');
var kramed = require('kramed');
var hljs = require('highlight.js');

var lnormalize = require('./utils/lang').normalize;
var annotate = require('./annotate');

var RAW_START = "{% raw %}";
var RAW_END = "{% endraw %}";

function escape(str) {
    return RAW_START + str + RAW_END;
}

// Combines annotated nodes
function combine(nodes) {
    return _.pluck(nodes, 'raw').join('');
}

function preparePage(src) {
    var lexed = annotate(src);

    // Escape code blocks
    var escaped = lexed.map(function(el) {
        if(el.type == 'code') {
            el.raw = escape(el.raw);
        }
        return el;
    })

    return combine(escaped);
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
