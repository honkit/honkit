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



function preparePage(src) {
    var lexed = annotate.blocks(src);
    var levelRaw = 0;

    var escapeCodeElement = function(el) {
        if (el.type == 'code' && levelRaw == 0) {
            el.raw = escape(el.raw);
        } else if (el.type == 'rawStart') {
            levelRaw = levelRaw + 1;
        } else if (el.type == 'rawStart') {
            levelRaw = levelRaw - 1;
        }
        return el;
    };

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
