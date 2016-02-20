var _ = require('lodash');
var kramed = require('kramed');

// Convert markdown to HTML
function convertMdToHTML(src) {
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

    return kramed(src, options);
}

module.exports = convertMdToHTML;
