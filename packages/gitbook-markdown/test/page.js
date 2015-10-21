var fs = require('fs');
var path = require('path');
var assert = require('assert');

var page = require('../').page;

function loadPage (name, options) {
    var CONTENT = fs.readFileSync(path.join(__dirname, './fixtures/' + name + '.md'), 'utf8');
    return page(CONTENT, options).sections;
}

var LEXED = loadPage('PAGE');

describe('Page parsing', function() {
    it('should detect sections', function() {
        assert.equal(LEXED.length, 1);
    });

    it('should gen content for normal sections', function() {
        assert(LEXED[0].content);
    });

    it('should not add id to headings', function() {
        assert.equal(page('# Hello').sections[0].content, '<h1>Hello</h1>\n');
         assert.equal(page('# Hello {#test}').sections[0].content, '<h1 id="test">Hello </h1>\n');
    });

    it('should escape codeblocks in preparation (1)', function() {
        assert.equal(page.prepare("Hello `world`"), "Hello {% raw %}`world`{% endraw %}");
        assert.equal(page.prepare("Hello `world test`"), "Hello {% raw %}`world test`{% endraw %}");
        assert.equal(page.prepare("Hello ```world test```"), "Hello {% raw %}```world test```{% endraw %}");
        assert.equal(page.prepare("Hello\n```js\nworld test\n```\n"), "Hello\n{% raw %}```js\nworld test\n```\n{% endraw %}");
        assert.equal(page.prepare("Hello\n```\ntest\n\tworld\n\ttest\n```"), "Hello\n{% raw %}```\ntest\n\tworld\n\ttest\n```{% endraw %}");
    });

    it('should escape codeblocks in preparation (2)', function() {
        assert.equal(
            page.prepare("Hello\n\n\n\tworld\n\thello\n\n\ntest"),
            "Hello\n\n\n{% raw %}\tworld\n\thello\n\n\n{% endraw %}test"
        );
        assert.equal(
            page.prepare("Hello\n\n\n\tworld\n\thello\n\n\n"),
            "Hello\n\n\n{% raw %}\tworld\n\thello\n\n\n{% endraw %}"
        );
    });

    it('should escape codeblocks with nunjucks tags', function() {
        assert.equal(
            page.prepare('Hello {{ "Bonjour" }} ```test```'),
            'Hello {{ "Bonjour" }} {% raw %}```test```{% endraw %}'
        );
    });

    it('should escape codeblocks with nunjucks tags in {% raw %} tags', function() {
        assert.equal(
            page.prepare('{% raw %}Hello {{ "Bonjour" }} ```test```{% endraw %}'),
            '{% raw %}Hello {{ "Bonjour" }} ```test```{% endraw %}'
        );
        assert.equal(
            page.prepare('{% raw %}Hello {{ "Bonjour" }} {% raw %}{% endraw %}```test```'),
            '{% raw %}Hello {{ "Bonjour" }} {% raw %}{% endraw %}{% raw %}```test```{% endraw %}'
        );
        assert.equal(
            page.prepare('```{% raw %}Hello {{ "Bonjour" }} {% raw %}```'),
            '{% raw %}```{% raw %}Hello {{ "Bonjour" }} {% raw %}```{% endraw %}'
        );

        assert.equal(
            page.prepare('```\ntest\n```\n\n\n### Test'),
            '{% raw %}```\ntest\n```\n{% endraw %}\n\n### Test'
        );
    });

    it('should not process math', function() {
        assert.equal(page.prepare("Hello $world$"), "Hello $world$");
        assert.equal(page.prepare("Hello $$world$$"), "Hello $$world$$");
    });
});
