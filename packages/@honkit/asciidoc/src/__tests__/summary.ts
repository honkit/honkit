import fs from "fs";
import path from "path";
import assert from "assert";
import asciidoc from "../";

var LEXED, PART;

beforeAll(function () {
    var CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/SUMMARY.adoc"), "utf8");
    LEXED = asciidoc.summary(CONTENT);
    PART = LEXED.parts[0];
    // todo: add support for parts in asciidoc
});

it("should detect parts", function () {
    assert.equal(LEXED.parts.length, 1);
});

it("should detect articles", function () {
    assert.equal(PART.articles.length, 5);
});

it("should support articles", function () {
    assert.equal(PART.articles[0].articles.length, 2);
    assert.equal(PART.articles[1].articles.length, 0);
    assert.equal(PART.articles[2].articles.length, 0);
});

it("should detect paths and titles", function () {
    assert(PART.articles[0].ref);
    assert(PART.articles[1].ref);
    assert(PART.articles[2].ref);
    assert(PART.articles[3].ref);
    assert.equal(PART.articles[4].ref, null);

    assert(PART.articles[0].title);
    assert(PART.articles[1].title);
    assert(PART.articles[2].title);
    assert(PART.articles[3].title);
    assert(PART.articles[4].title);
});

it("should normalize paths from .md", function () {
    assert.equal(PART.articles[0].ref, "chapter-1/README.adoc");
    assert.equal(PART.articles[1].ref, "chapter-2/README.adoc");
    assert.equal(PART.articles[2].ref, "chapter-3/README.adoc");
});

it("should correctly convert it to text", function () {
    var text = asciidoc.summary.toText(LEXED);
    assert.deepEqual(asciidoc.summary(text), LEXED);
});
