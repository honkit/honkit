var fs = require('fs');
var path = require('path');
var assert = require('assert');

var page = require('../').page;

describe('Page parsing', function() {
    var LEXED;

    before(function() {
        var CONTENT = fs.readFileSync(path.join(__dirname, './fixtures/PAGE.md'), 'utf8');
        LEXED = page(CONTENT);
    });

    it('should gen content', function() {
        assert(LEXED.content);
    });

    it('should not add id to headings', function() {
        assert.equal(page('# Hello').content, '<h1>Hello</h1>');
        assert.equal(page('# Hello {#test}').content, '<h1 id="test">Hello</h1>');
    });

    it('should escape codeblocks in preparation (1)', function() {
        assert.equal(page.prepare("Hello `world`"), 'Hello {% raw %}`world`{% endraw %}\n\n');
        assert.equal(page.prepare("Hello `world test`"), 'Hello {% raw %}`world test`{% endraw %}\n\n');
        assert.equal(page.prepare("Hello ```world test```"), 'Hello {% raw %}`world test`{% endraw %}\n\n');
        assert.equal(page.prepare("Hello\n```js\nworld test\n```\n"), 'Hello\n\n{% raw %}```js\nworld test\n```\n\n{% endraw %}');
        assert.equal(page.prepare("Hello\n```\ntest\n\tworld\n\ttest\n```"), 'Hello\n\n{% raw %}```\ntest\n    world\n    test\n```\n\n{% endraw %}');
    });

    it('should escape codeblocks in preparation (2)', function() {
        assert.equal(
            page.prepare("Hello\n\n\n\tworld\n\thello\n\n\ntest"),
            'Hello\n\n{% raw %}```\nworld\nhello```\n\n{% endraw %}test\n\n'
        );
        assert.equal(
            page.prepare("Hello\n\n\n\tworld\n\thello\n\n\n"),
            'Hello\n\n{% raw %}```\nworld\nhello```\n\n{% endraw %}'
        );
    });

    it('should escape codeblocks with nunjucks tags', function() {
        assert.equal(
            page.prepare('Hello {{ "Bonjour" }} ```test```'),
            'Hello {{ "Bonjour" }} {% raw %}`test`{% endraw %}\n\n'
        );
    });

    it('should escape codeblocks with nunjucks tags in {% raw %} tags', function() {
        assert.equal(
            page.prepare('{% raw %}Hello {{ "Bonjour" }} ```test```{% endraw %}'),
            '{% raw %}Hello {{ "Bonjour" }} `test`{% endraw %}\n\n'
        );
        assert.equal(
            page.prepare('{% raw %}Hello {{ "Bonjour" }} {% raw %}{% endraw %}```test```'),
            '{% raw %}Hello {{ "Bonjour" }} {% raw %}{% endraw %}{% raw %}`test`{% endraw %}\n\n'
        );
        assert.equal(
            page.prepare('```{% raw %}Hello {{ "Bonjour" }} {% raw %}```'),
            '{% raw %}`{% raw %}Hello {{ "Bonjour" }} {% raw %}`{% endraw %}\n\n'
        );

        assert.equal(
            page.prepare('```\ntest\n```\n\n\n### Test'),
            '{% raw %}```\ntest\n```\n\n{% endraw %}### Test\n\n'
        );
    });

    it('should not process math', function() {
        assert.equal(page.prepare("Hello $world$"), 'Hello $world$\n\n');
        assert.equal(page.prepare("Hello $$world$$"), 'Hello $$world$$\n\n');
    });
});
