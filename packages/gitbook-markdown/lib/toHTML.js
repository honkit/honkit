var _ = require('lodash');
var kramed = require('kramed');

/**
    Get renderer for kramed with correct configuration

    @return {kramed.Renderer}
*/
function getRenderer() {
    return new kramed.Renderer({
        langPrefix: 'lang-',
        smartypants: false,
        headerPrefix: '',
        headerAutoId: false,
        xhtml: false
    });
}

/**
    Get options for markdown parsing

    @return {Object}
*/
function getOption() {
    return _.extend({}, kramed.defaults, {
        mathjax: false
    });
}

/**
    Convert Markdown block to HTML

    @param {String} src (markdown)
    @return {String} (html)
*/
function convertMdToHTMLBlock(src) {
    var options = _.extend(getOption(), {
        renderer: getRenderer()
    });

    return kramed(src, options);
}

/**
    Convert Markdown inline to HTML

    @param {String} src (markdown)
    @return {String} (html)
*/
function convertMdToHTMLInline(src) {
    return kramed.inlineLexer(src, getOption(), getRenderer());
}

module.exports = {
    block: convertMdToHTMLBlock,
    inline: convertMdToHTMLInline
};
