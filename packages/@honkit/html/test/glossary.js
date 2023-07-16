import fs from "fs";
import path from "path";
import assert from "assert";
import html from "../";
describe('Glossary parsing', () => {
    let LEXED;

    before(() => {
        const CONTENT = fs.readFileSync(path.join(__dirname, './fixtures/GLOSSARY.html'), 'utf8');
        LEXED = html.glossary(CONTENT);
    });

    it('should only get heading + paragraph pairs', () => {
        assert.equal(LEXED.length, 5);
    });

    it('should output simple name/description objects', () => {
        assert.equal(true, !(LEXED.some((e) => {
            return !(e.name && e.description);
        })));
    });

    it('should correctly convert it to text', () => {
        const text = html.glossary.toText(LEXED);
        assertObjectsEqual(html.glossary(text), LEXED);
    });
});
