var fs = require("fs");
var path = require("path");
var assert = require("assert");

var langs = require("../lib").langs;

var LEXED;

beforeAll(function () {
    var CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/LANGS.adoc"), "utf8");
    LEXED = langs(CONTENT);
});

it("should detect paths and titles", function () {
    assert.equal(LEXED[0].ref, "en/");
    assert.equal(LEXED[0].title, "English");

    assert.equal(LEXED[1].ref, "fr/");
    assert.equal(LEXED[1].title, "French");
});

it("should correctly convert it to text", function () {
    var text = langs.toText(LEXED);
    assert.deepEqual(langs(text), LEXED);
});
