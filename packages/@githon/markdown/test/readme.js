const fs = require('fs');
const path = require('path');
const assert = require('assert');

const readme = require('../').readme;

describe('Readme parsing', () => {
    let LEXED;

    before(() => {
        const CONTENT = fs.readFileSync(path.join(__dirname, './fixtures/README.md'), 'utf8');
        LEXED = readme(CONTENT);
    });

    it('should contain a title', () => {
        assert(LEXED.title);
    });

    it('should contain a description', () => {
        assert(LEXED.description);
    });

    it('should extract the right title', () => {
        assert.equal(LEXED.title, "This is the title");
    });

    it('should extract the right description', () => {
        assert.equal(LEXED.description, "This is the book description.");
    });
});
