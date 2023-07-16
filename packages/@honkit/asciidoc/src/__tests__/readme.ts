import fs from "fs";
import path from "path";
import assert from "assert";
import asciidoc from "../";

var LEXED;

beforeAll(function () {
    var CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/README.adoc"), "utf8");
    LEXED = asciidoc.readme(CONTENT);
});

it("should contain a title", function () {
    assert(LEXED.title);
});

it("should contain a description", function () {
    assert(LEXED.description);
});

it("should extract the right title", function () {
    assert.equal(LEXED.title, "This is the title");
});

it("should extract the right description", function () {
    assert.equal(LEXED.description, "This is the book description.");
});
