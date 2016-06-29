var _ = require('lodash');
var MarkupIt = require('markup-it');
var gitbookSyntax = require('markup-it/syntaxes/markdown');

var RAW_START = '{% raw %}';
var RAW_END   = '{% endraw %}';
var markdown  = new MarkupIt(gitbookSyntax);

/**
 * Escape a code block's content using raw blocks
 *
 * @param {String}
 * @return {String}
 */
function escape(str) {
    return RAW_START + str + RAW_END;
}


/**
 * Add templating "raw" to code blocks to
 * avoid nunjucks processing their content.
 *
 * @param {String} src
 * @return {String}
 */
function preparePage(src) {
    var levelRaw = 0;
    var content  = markdown.toContent(src, {
        math:     true,
        template: true
    });

    var textMarkdown = markdown.toText(content, {
        annotate: function(state, raw, token) {
            var tokenType = token.getType();

            if (tokenType === MarkupIt.ENTITIES.TEMPLATE) {
                var type = token.getData().get('type');
                var expr = token.getAsPlainText();

                if (type === 'expr') {
                    if (expr === 'raw') {
                        levelRaw = levelRaw + 1;
                    } else if (expr == 'endraw') {
                        levelRaw = 0;
                    }
                }
            }

            if (
                (tokenType === MarkupIt.BLOCKS.CODE || tokenType === MarkupIt.STYLES.CODE)
                && levelRaw === 0
            ) {
                return escape(raw);
            }

            return raw;
        }
    });

    return textMarkdown;
}

module.exports = {
    prepare: preparePage
};
