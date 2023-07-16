import html from "../";
import fs from "fs";
import path from "path";
import assert from "assert";

describe('Languages parsing', () => {
    let LEXED;

    before(() => {
        const CONTENT = fs.readFileSync(path.join(__dirname, './fixtures/LANGS.html'), 'utf8');
        LEXED = html.langs(CONTENT);
    });

    it('should detect paths and titles', () => {
        assert.equal(LEXED[0].ref,'en/');
        assert.equal(LEXED[0].title,'English');

        assert.equal(LEXED[1].ref,'fr/');
        assert.equal(LEXED[1].title,'French');
    });

    it('should correctly convert it to text', () => {
        const text = html.langs.toText(LEXED);
        assertObjectsEqual(html.langs(text), LEXED);
    });
});
