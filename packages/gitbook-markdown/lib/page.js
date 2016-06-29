var _ = require('lodash');
var MarkupIt = require('markup-it');
var gitbookSyntax = require('markup-it/syntaxes/gitbook');

var RAW_START = '{% raw %}';
var RAW_END   = '{% endraw %}';
var gitbook  = new MarkupIt(gitbookSyntax);

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

    return gitbook.annotate(src, function(token) {
        var tokenType = token.getType();

        if (tokenType === MarkupIt.BLOCKS.TEMPLATE && tokenType === MarkupIt.STYLES.TEMPLATE) {
            var expr = token.getData().get('type');
            if (expr === 'raw') {
                levelRaw = levelRaw + 1;
            } else if (expr == 'endraw') {
                levelRaw = 0;
            }

            return true;
        }

        if (token.isBlock() && )



        if (tokenType !== MarkupIt.BLOCKS.CODE && tokenType !== MarkupIt.STYLES.CODE && levelRaw == 0) {
            return;
        }

        return escape(token.getRaw());
    });
}

module.exports = {
    prepare: preparePage
};
