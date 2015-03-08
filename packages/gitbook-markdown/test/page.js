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
        assert.equal(page.prepare("Hello `world`"), "\nHello {% raw %}`world`{% endraw %}\n");
        assert.equal(page.prepare("Hello `world test`"), "\nHello {% raw %}`world test`{% endraw %}\n");
        assert.equal(page.prepare("Hello ```world test```"), "\nHello {% raw %}`world test`{% endraw %}\n");
        assert.equal(page.prepare("Hello\n```js\nworld test\n```\n"), "\nHello\n{% raw %}\n```js\nworld test\n```\n{% endraw %}");
        assert.equal(page.prepare("Hello\n```\ntest\n\tworld\n\ttest\n```"), "\nHello\n{% raw %}\n```\ntest\n    world\n    test\n```\n{% endraw %}");
    });

    it('should escape codeblocks in preparation (2)', function() {
        assert.equal(
            page.prepare("Hello\n\n\n\tworld\n\thello\n\n\ntest"),
            "\nHello\n{% raw %}\n```\nworld\nhello\n```\n{% endraw %}\ntest\n"
        );
        assert.equal(
            page.prepare("Hello\n\n\n\tworld\n\thello\n\n\n"),
            "\nHello\n{% raw %}\n```\nworld\nhello\n```\n{% endraw %}"
        );
    });
});
