import markdown from "../";
import assert from "assert";
import path from "path";
import fs from "fs";
const langs = markdown.langs;
describe("Languages parsing", () => {
    let LEXED;

    beforeAll(() => {
        const CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/LANGS.md"), "utf8");
        LEXED = langs(CONTENT);
    });

    it("should detect paths and titles", () => {
        assert.equal(LEXED.length, 2);
        assert.equal(LEXED[0].ref, "en/");
        assert.equal(LEXED[0].title, "English");

        assert.equal(LEXED[1].ref, "fr/");
        assert.equal(LEXED[1].title, "French");
    });

    it("should correctly convert it to text", () => {
        const text = langs.toText(LEXED);
        assert.deepEqual(langs(text), LEXED);
    });
});
