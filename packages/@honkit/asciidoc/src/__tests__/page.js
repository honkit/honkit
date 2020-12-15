var fs = require("fs");
var path = require("path");
var assert = require("assert");

var page = require("../").page;

var LEXED;

beforeAll(function () {
    var CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/PAGE.adoc"), "utf8");
    LEXED = page(CONTENT);
});

it("should gen content", function () {
    assert(LEXED.content);
});

it("should include file", function () {
    const result = page(`= GitBook User Manual

== Usage

include::src/__tests__/fixtures/usage.adoc[]
`).content;
    // assert.match is available in Node > 12.16.0
    assert(result.match(/create a book/g) !== null);
});
