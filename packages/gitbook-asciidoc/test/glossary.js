var fs = require('fs');
var path = require('path');
var assert = require('assert');

var glossary = require('../').glossary;

var CONTENT = fs.readFileSync(path.join(__dirname, './fixtures/GLOSSARY.adoc'), 'utf8');
var LEXED = glossary(CONTENT);

describe('Glossary parsing', function () {
    it('should only get heading + paragraph pairs', function() {
        assert.equal(LEXED.length, 5);
    });

    it('should output simple name/description objects', function() {
        assert.equal(true, !(LEXED.some(function(e) {
            return !Boolean(e.name && e.description);
        })));
    });

    it('should correctly convert it to text', function() {
        var text = glossary.toText(LEXED);
        assertObjectsEqual(glossary(text), LEXED);
    });
});
