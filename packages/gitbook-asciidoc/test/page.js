var fs = require('fs');
var path = require('path');
var assert = require('assert');

var page = require('../').page;

describe('Page parsing', function() {
    var LEXED;

    before(function() {
        var CONTENT = fs.readFileSync(path.join(__dirname, './fixtures/PAGE.adoc'), 'utf8');
        LEXED = page(CONTENT);
    });

    it('should gen content', function() {
        assert(LEXED.content);
    });
});
