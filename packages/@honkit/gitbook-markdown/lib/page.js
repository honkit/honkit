var Q = require('q');
var _ = require('lodash');
var kramed = require('kramed');

var hljs = require('highlight.js');

var lnormalize = require('./utils/lang').normalize;

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
