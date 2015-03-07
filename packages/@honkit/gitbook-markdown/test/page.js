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

    it('should escape codeblocks in preparation (1)', function() {
        assert.equal(page.prepare("Hello `world`"), "Hello {% raw %}`world`{% endraw %}");
        assert.equal(page.prepare("Hello `world test`"), "Hello {% raw %}`world test`{% endraw %}");
        assert.equal(page.prepare("Hello ```world test```"), "Hello {% raw %}```world test```{% endraw %}");
        assert.equal(page.prepare("Hello\n```js\nworld test\n```\n"), "Hello\n{% raw %}```js\nworld test\n```{% endraw %}\n");
    });

    it('should escape codeblocks in preparation (2)', function() {
        assert.equal(
            page.prepare("Hello\n\n\n\tworld\n\thello\n\n\ntest"),
            "Hello\n{% raw %}\n\n\tworld\n\thello\n\n\n{% endraw %}test"
        );
        assert.equal(
            page.prepare("Hello\n\n\n\tworld\n\thello\n\n\n"),
            "Hello\n{% raw %}\n\n\tworld\n\thello\n\n\n{% endraw %}"
        );
    });
});
