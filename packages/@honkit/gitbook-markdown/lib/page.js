var _ = require('lodash');
var kramed = require('kramed');

var annotate = require('kramed/lib/annotate/');

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
        } else if (el.type == 'tplexpr') {
            var expr = el.matches[0];
            if(expr === 'raw') {
                levelRaw = levelRaw + 1;
            } else if(expr === 'endraw') {
                levelRaw = 0;
            }
        }
        return el;
    };

    var escaped = lexed
    .map(function(el) {
        // Only escape paragraphs and headings
        if(el.type == 'paragraph' || el.type == 'heading') {
            var line = annotate.inline(el.raw);

            // Escape inline code blocks
            line = line.map(escapeCodeElement);

            // Change raw source code
            el.raw = combine(line);

            return el;
        } else {
            return escapeCodeElement(el);
        }
    });

    return combine(escaped);
}

function parsePage(src) {
    var options = _.extend({}, kramed.defaults, {
        mathjax: false,
        renderer: new kramed.Renderer({
            langPrefix: 'lang-',
            smartypants: false,
            headerPrefix: '',
            headerAutoId: false,
            xhtml: false
        })
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
