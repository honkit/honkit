var _ = require('lodash');
var kramed = require('kramed');
var hljs = require('highlight.js');

var lnormalize = require('./utils/lang').normalize;
var mdRenderer = require('kramed-markdown-renderer');

var RAW_START = "{% raw %}";
var RAW_END = "{% endraw %}";

function preparePage(src) {
    var renderer = mdRenderer();

    var escape = function(func, code, lang, escaped) {
        return RAW_START+func(code, lang, escaped)+RAW_END;
    };

    renderer.code = _.wrap(renderer.code, escape);
    renderer.codespan = _.wrap(renderer.codespan, escape);

    var options = _.extend({}, kramed.defaults, {
        renderer: renderer,
        escape: false
    });

    return kramed(src, options);
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
