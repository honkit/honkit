var _ = require('lodash');
var kramed = require('kramed');

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

function escapeCodeElement(el) {
    if(el.type == 'code') {
        el.raw = escape(el.raw);
    }
    return el;
}

function preparePage(src) {
    var lexed = annotate.blocks(src);


    var escaped = lexed
    // Escape code blocks
    .map(escapeCodeElement)
    // Escape inline code blocks
    .map(function(el) {
        // Only escape paragraphs and headings
        if(!(el.type == 'paragraph' || el.type == 'heading')) {
            return el;
        }

        // Escape inline code blocks
        var newInline = annotate.inline(el.raw).map(escapeCodeElement);

        // Change raw source code
        el.raw = combine(newInline);

        return el;
    });

    return combine(escaped);
}

function parsePage(src) {
    var options = _.extend({}, kramed.defaults, {
        mathjax: false
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
