var cheerio = require('cheerio');
var Promise = require('../../../utils/promise');
var highlightCode = require('../highlightCode');

describe('highlightCode', () => {
    function doHighlight(lang, code) {
        return {
            text: '' + (lang || '') + '$' + code
        };
    }

    function doHighlightAsync(lang, code) {
        return Promise()
            .then(function() {
                return doHighlight(lang, code);
            });
    }

    test('should call it for normal code element', () => {
        var $ = cheerio.load('<p>This is a <code>test</code></p>');

        return highlightCode(doHighlight, $)
            .then(function() {
                var $code = $('code');
                expect($code.text()).toBe('$test');
            });
    });

    test('should call it for markdown code block', () => {
        var $ = cheerio.load('<pre><code class="lang-js">test</code></pre>');

        return highlightCode(doHighlight, $)
            .then(function() {
                var $code = $('code');
                expect($code.text()).toBe('js$test');
            });
    });

    test('should call it for asciidoc code block', () => {
        var $ = cheerio.load('<pre><code class="language-python">test</code></pre>');

        return highlightCode(doHighlight, $)
            .then(function() {
                var $code = $('code');
                expect($code.text()).toBe('python$test');
            });
    });

    test('should accept async highlighter', () => {
        var $ = cheerio.load('<pre><code class="language-python">test</code></pre>');

        return highlightCode(doHighlightAsync, $)
            .then(function() {
                var $code = $('code');
                expect($code.text()).toBe('python$test');
            });
    });
});


