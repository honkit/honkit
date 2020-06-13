var Book = require("../../models/book");
var createMockFS = require("../../fs/mock");

describe("parseGlossary", () => {
    var parseGlossary = require("../parseGlossary");

    test("should parse glossary if exists", () => {
        var fs = createMockFS({
            "GLOSSARY.md": "# Glossary\n\n## Hello\nDescription for hello",
        });
        var book = Book.createForFS(fs);

        return parseGlossary(book).then(function (resultBook) {
            var glossary = resultBook.getGlossary();
            var file = glossary.getFile();
            var entries = glossary.getEntries();

            expect(file.exists()).toBeTruthy();
            expect(entries.size).toBe(1);
        });
    });

    test("should not fail if doesn't exist", () => {
        var fs = createMockFS({});
        var book = Book.createForFS(fs);

        return parseGlossary(book).then(function (resultBook) {
            var glossary = resultBook.getGlossary();
            var file = glossary.getFile();

            expect(file.exists()).toBeFalsy();
        });
    });
});
