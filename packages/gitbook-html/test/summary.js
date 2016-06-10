var fs = require('fs');
var path = require('path');
var assert = require('assert');

var summary = require('../').summary;

describe('Summary parsing', function () {
    var LEXED, PART;
    var LEXED_EMPTY;

    before(function() {
        var CONTENT = fs.readFileSync(
            path.join(__dirname, './fixtures/SUMMARY.html'), 'utf8');
        LEXED = summary(CONTENT);
        PART = LEXED.parts[0];

        var CONTENT_EMPTY = fs.readFileSync(
            path.join(__dirname, './fixtures/SUMMARY-EMPTY.html'), 'utf8');
        LEXED_EMPTY = summary(CONTENT_EMPTY);
    });

    describe('Parts', function() {
        it('should detect parts', function() {
            assert.equal(LEXED.parts.length, 3);
        });

        it('should detect title', function() {
            assert.equal(LEXED.parts[0].title, '');
            assert.equal(LEXED.parts[1].title, 'Part 2');
            assert.equal(LEXED.parts[2].title, '');
        });

        it('should detect empty parts', function() {
            var partTitles = LEXED_EMPTY.parts.map(function (part) {
                return part.title;
            });
            var expectedTitles = [
                'First empty part',
                'Part 1',
                '',
                'Empty part',
                'Part 2',
                'Penultimate empty part',
                'Last empty part'
            ];
            assert.equal(LEXED_EMPTY.parts.length, 7);
            expectedTitles.forEach(function (title, index) {
                assert.equal(partTitles[index], title);
            });
        });
    });

    it('should detect chapters', function() {
        assert.equal(PART.articles.length, 5);
    });

    it('should detect chapters in other parts', function() {
        assert.equal(LEXED.parts[1].articles.length, 1);
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
        assert.equal(PART.articles[0].ref,'chapter-1/README.md');
        assert.equal(PART.articles[1].ref,'chapter-2/README.md');
        assert.equal(PART.articles[2].ref,'chapter-3/README.md');
    });

    it('should correctly convert it to text', function() {
        var text = summary.toText(LEXED);
        assertObjectsEqual(summary(text), LEXED);
    });
});
