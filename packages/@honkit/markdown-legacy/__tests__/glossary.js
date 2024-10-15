var fs = require("fs");
var path = require("path");
var assert = require("assert");

var glossary = require("../").glossary;

describe("Glossary parsing", function () {
    var LEXED;

    beforeAll(function () {
        var CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/GLOSSARY.md"), "utf8");
        LEXED = glossary(CONTENT);
    });

    it("should only get heading + paragraph pairs", function () {
        assert.equal(LEXED.length, 5);
    });

    it("should output simple name/description objects", function () {
        assert.equal(
            true,
            !LEXED.some(function (e) {
                return !Boolean(e.name && e.description);
            })
        );
    });

    it("should correctly convert it to text", function () {
        var text = glossary.toText(LEXED);
        assert.deepStrictEqual(glossary(text), LEXED);
    });

    it("should correctly handle dots at the start of terms", function () {
        assert.equal(LEXED[4].name, ".MD file");
    });
});
