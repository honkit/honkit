import assert from "assert";
import path from "path";
import fs from "fs";
import markdown from "../";

const glossary = markdown.glossary;
describe("Glossary parsing", () => {
    let LEXED;

    beforeAll(() => {
        const CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/GLOSSARY.md"), "utf8");
        LEXED = glossary(CONTENT);
    });

    it("should only get heading + paragraph pairs", () => {
        assert.equal(LEXED.length, 4);
    });

    it("should output simple name/description objects", () => {
        assert.equal(
            true,
            !LEXED.some((e) => {
                return !(e.name && e.description);
            })
        );
    });

    it("should correctly convert it to text", () => {
        const text = glossary.toText(LEXED);
        assert.deepEqual(glossary(text), LEXED);
    });
});
