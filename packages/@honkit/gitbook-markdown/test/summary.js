var fs = require('fs');
var path = require('path');
var assert = require('assert');

var summary = require('../').summary;

function lex(fixtureFile) {
    return summary(
        fs.readFileSync(
            path.join(__dirname, 'fixtures', fixtureFile),
            'utf8'
        )
    );
}

describe('Summary parsing', function () {
    var LEXED;

    before(function() {
        LEXED = lex('SUMMARY.md');
        PART = LEXED.parts[0];
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
        assert(PART.articles[0].ref);
        assert(PART.articles[1].ref);
        assert(PART.articles[2].ref);
        assert(PART.articles[3].ref);
        assert.equal(PART.articles[4].ref, null);

        assert(PART.articles[0].title);
        assert(PART.articles[1].title);
        assert(PART.articles[2].title);
        assert(PART.articles[3].title);
        assert(PART.articles[4].title);
    });

    it('should normalize paths from .md', function() {
        assert.equal(PART.articles[0].ref, 'chapter-1/README.md');
        assert.equal(PART.articles[1].ref, 'chapter-2/README.md');
        assert.equal(PART.articles[2].ref, 'chapter-3/README.md');
    });

    it('should part parts', function() {
        var l = lex('SUMMARY_PARTS.md');
        assert.equal(l.parts.length, 3);
    });

    it('should allow lists separated by whitespace', function() {
        var l = lex('SUMMARY_WHITESPACE.md');
        assert.equal(l.parts[0].articles.length, 5);
    });

    it('should allow ignore empty entries', function() {
        var l = lex('SUMMARY_EMPTY.md');
        assert.equal(l.parts[0].articles.length, 1);
    });

    it('should correctly convert it to text', function() {
        var text = summary.toText(LEXED);
        assertObjectsEqual(summary(text), LEXED);
    });
});
