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

var LEXED = lex('SUMMARY.md');

describe('Summary parsing', function () {
    it('should detect chapters', function() {
        assert.equal(LEXED.chapters.length, 5);
    });

    it('should support articles', function() {
        assert.equal(LEXED.chapters[0].articles.length, 2);
        assert.equal(LEXED.chapters[1].articles.length, 0);
        assert.equal(LEXED.chapters[2].articles.length, 0);
    });

    it('should detect paths and titles', function() {
        assert(LEXED.chapters[0].path);
        assert(LEXED.chapters[1].path);
        assert(LEXED.chapters[2].path);
        assert(LEXED.chapters[3].path);
        assert.equal(LEXED.chapters[4].path, null);

        assert(LEXED.chapters[0].title);
        assert(LEXED.chapters[1].title);
        assert(LEXED.chapters[2].title);
        assert(LEXED.chapters[3].title);
        assert(LEXED.chapters[4].title);
    });

    it('should normalize paths from .md', function() {
        assert.equal(LEXED.chapters[0].path,'chapter-1/README.md');
        assert.equal(LEXED.chapters[1].path,'chapter-2/README.md');
        assert.equal(LEXED.chapters[2].path,'chapter-3/README.md');
    });

    it('should allow lists separated by whitespace', function() {
        var l = lex('SUMMARY_WHITESPACE.md');
        assert.equal(l.chapters.length, 5);
    });

    it('should allow ignore empty entries', function() {
        var l = lex('SUMMARY_EMPTY.md');
        assert.equal(l.chapters.length, 1);
    });

    it('should throw error for sublist entries', function() {
        assert.throws(
            function() {
                var l = lex('SUMMARY_SUBLIST.md');
            },
            "Invalid entry in the SUMMARY"
        );
    });

    it('should correctly convert it to text', function() {
        var text = summary.toText(LEXED);
        assertObjectsEqual(summary(text), LEXED);
    });
});
