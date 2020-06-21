import fs from "fs";
import path from "path";
import assert from "assert";

const glossary = require("../").glossary;

let LEXED;

beforeAll(() => {
    const CONTENT = fs.readFileSync(path.join(__dirname, "fixtures/GLOSSARY.adoc"), "utf8");
    LEXED = glossary(CONTENT);
});

it("should only get heading + paragraph pairs", () => {
    assert.equal(LEXED.length, 4);
});

it("should output simple name/description objects", () => {
    assert.equal(
        true,
        !LEXED.some((e) => {
            return !Boolean(e.name && e.description);
        })
    );
});

it("should correctly convert it to text", () => {
    const text = glossary.toText(LEXED);
    assert.deepEqual(glossary(text), LEXED);
});
