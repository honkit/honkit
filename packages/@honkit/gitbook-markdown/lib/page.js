var _ = require('lodash');
var kramed = require('kramed');
var annotate = require('kramed/lib/annotate/');

var RAW_START = '{% raw %}';
var RAW_END = '{% endraw %}';

/**
    Escape a code block's content using raw blocks

    @param {String}
    @return {String}
*/
function escape(str) {
    return RAW_START + str + RAW_END;
}

/**
    Combines annotated nodes

    @param {Array}
    @return {String}
*/
function combine(nodes) {
    return _.map(nodes, 'raw').join('');
}

/**
    Add templating "raw" to code blocks to
    avoid nunjucks processing their content.

    @param {String} src
    @return {String}
*/
function preparePage(src) {
    var lexed = annotate.blocks(src);
    var levelRaw = 0;

    function escapeCodeElement(el) {
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
    }

    var escaped = _.map(lexed, function(el) {
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

module.exports = {
    prepare: preparePage
};
