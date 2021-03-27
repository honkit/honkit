const hljs = require("highlight.js");

const MAP = {
    py: "python",
    js: "javascript",
    json: "javascript",
    rb: "ruby",
    csharp: "cs",
};

function normalize(lang) {
    if (!lang) {
        return null;
    }

    const lower = lang.toLowerCase();
    return MAP[lower] || lower;
}

/**
 * @param {string} lang
 * @param {string} code
 * @returns {string|{html: boolean, body}}
 */
function highlight(lang, code) {
    if (!lang)
        return {
            body: code,
            html: false,
        };

    // Normalize lang
    lang = normalize(lang);

    try {
        return hljs.highlight(code, {
            language: lang,
        }).value;
    } catch (e) {
        console.error(e);
    }

    return {
        body: code,
        html: false,
    };
}

module.exports = {
    book: {
        assets: "./css",
        css: ["website.css"],
    },
    ebook: {
        assets: "./css",
        css: ["ebook.css"],
    },
    blocks: {
        code: function (block) {
            return highlight(block.kwargs.language, block.body);
        },
    },
};
