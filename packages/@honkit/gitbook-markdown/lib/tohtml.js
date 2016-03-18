var _ = require('lodash');
var kramed = require('kramed');

// Get renderer for kramed
function getRenderer() {
    return new kramed.Renderer({
        langPrefix: 'lang-',
        smartypants: false,
        headerPrefix: '',
        headerAutoId: false,
        xhtml: false
    });
}

// Get options for markdown parsing
function getOption() {
    return _.extend({}, kramed.defaults, {
        mathjax: false
    });
}

// Convert Markdown to HTML
function convertMdToHTMLBlock(src) {
    var options = _.extend(getOption(), {
        renderer: getRenderer()
    });

    return kramed(src, options);
}

// Convert Markdown to HTML (inline)
function convertMdToHTMLInline(src) {
    return kramed.inlineLexer(src, getOption(), getRenderer());
}

module.exports = {
    block: convertMdToHTMLBlock,
    inline: convertMdToHTMLInline
};
