const fs = require('fs');
const path = require('path');
const assert = require('assert');

const langs = require('../').langs;

describe('Languages parsing', () => {
    let LEXED;

    before(() => {
        const CONTENT = fs.readFileSync(path.join(__dirname, './fixtures/LANGS.md'), 'utf8');
        LEXED = langs(CONTENT);
    });

    it('should detect paths and titles', () => {
        assert.equal(LEXED.length, 2);
        assert.equal(LEXED[0].ref,'en/');
        assert.equal(LEXED[0].title,'English');

        assert.equal(LEXED[1].ref,'fr/');
        assert.equal(LEXED[1].title,'French');
    });

    it('should correctly convert it to text', () => {
        const text = langs.toText(LEXED);
        assertObjectsEqual(langs(text), LEXED);
    });
});
