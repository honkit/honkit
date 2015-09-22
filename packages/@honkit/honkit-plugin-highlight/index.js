var path = require('path');
var hljs = require('highlight.js');

var MAP = {
    'py': 'python',
    'js': 'javascript',
    'json': 'javascript',
    'rb': 'ruby',
    'csharp': 'cs',
};

function normalize(lang) {
    if(!lang) { return null; }

    var lower = lang.toLowerCase();
    return MAP[lower] || lower;
}

function highlight(lang, code) {
    if(!lang) return {
        body: code,
        html: false
    };

    // Normalize lang
    lang = normalize(lang);

    try {
        return hljs.highlight(lang, code).value;
    } catch(e) { }

    return code;
}


module.exports = {
    book: {
        assets: './css',
        css: [
            'website.css'
        ]
    },
    ebook: {
        assets: './css',
        css: [
            'ebook.css'
        ]
    },
    blocks: {
        code: function(block) {
            return highlight(block.kwargs.language, block.body);
        }
    }
};
