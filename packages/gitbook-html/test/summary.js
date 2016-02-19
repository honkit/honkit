var fs = require('fs');
var path = require('path');
var assert = require('assert');

var summary = require('../').summary;

describe('Summary parsing', function () {
    var LEXED, PART;

    before(function() {
        var CONTENT = fs.readFileSync(path.join(__dirname, './fixtures/SUMMARY.html'), 'utf8');
        LEXED = summary(CONTENT);
        PART = LEXED.parts[0];
    });

    it('should detect parts', function() {
        assert.equal(LEXED.parts.length, 3);
    });

    it('should detect chapters', function() {
        assert.equal(PART.articles.length, 5);
    });

    it('should support articles', function() {
        assert.equal(PART.articles[0].articles.length, 2);
        assert.equal(PART.articles[1].articles.length, 0);
        assert.equal(PART.articles[2].articles.length, 0);
    });

    it('should detect paths and titles', function() {
        assert(PART.articles[0].path);
        assert(PART.articles[1].path);
        assert(PART.articles[2].path);
        assert(PART.articles[3].path);
        assert.equal(PART.articles[4].path, null);

        assert(PART.articles[0].title);
        assert(PART.articles[1].title);
        assert(PART.articles[2].title);
        assert(PART.articles[3].title);
        assert(PART.articles[4].title);
    });

    it('should normalize paths from .md', function() {
        assert.equal(PART.articles[0].path,'chapter-1/README.md');
        assert.equal(PART.articles[1].path,'chapter-2/README.md');
        assert.equal(PART.articles[2].path,'chapter-3/README.md');
    });

    it('should correctly convert it to text', function() {
        var text = summary.toText(LEXED);
        assertObjectsEqual(summary(text), LEXED);
    });
});
