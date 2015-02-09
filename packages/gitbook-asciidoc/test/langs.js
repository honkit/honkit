var fs = require('fs');
var path = require('path');
var assert = require('assert');

var langs = require('../').langs;

var CONTENT = fs.readFileSync(path.join(__dirname, './fixtures/LANGS.adoc'), 'utf8');
var LEXED = langs(CONTENT);

describe('Languages parsing', function () {
    it('should detect paths and titles', function() {
        assert.equal(LEXED[0].path,'en/');
        assert.equal(LEXED[0].title,'English');

        assert.equal(LEXED[1].path,'fr/');
        assert.equal(LEXED[1].title,'French');
    });

    it('should correctly convert it to text', function() {
        var text = langs.toText(LEXED);
        assertObjectsEqual(langs(text), LEXED);
    });
});
