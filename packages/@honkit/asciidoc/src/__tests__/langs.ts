import fs from "fs";
import path from "path";
import assert from "assert";
import asciidoc from "../";

var LEXED;

beforeAll(function () {
    var CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/LANGS.adoc"), "utf8");
    LEXED = asciidoc.langs(CONTENT);
});

it("should detect paths and titles", function () {
    assert.equal(LEXED[0].ref, "en/");
    assert.equal(LEXED[0].title, "English");

    assert.equal(LEXED[1].ref, "fr/");
    assert.equal(LEXED[1].title, "French");
});

it("should correctly convert it to text", function () {
    var text = asciidoc.langs.toText(LEXED);
    assert.deepEqual(asciidoc.langs(text), LEXED);
});
