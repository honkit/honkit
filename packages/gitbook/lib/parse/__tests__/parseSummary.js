var Book = require('../../models/book');
var createMockFS = require('../../fs/mock');

describe('parseSummary', () => {
    var parseSummary = require('../parseSummary');

    test('should parse summary if exists', () => {
        var fs = createMockFS({
            'SUMMARY.md': '# Summary\n\n* [Hello](hello.md)'
        });
        var book = Book.createForFS(fs);

        return parseSummary(book)
            .then(function(resultBook) {
                var summary = resultBook.getSummary();
                var file = summary.getFile();

                expect(file.exists()).toBeTruthy();
            });
    });

    test('should not fail if doesn\'t exist', () => {
        var fs = createMockFS({});
        var book = Book.createForFS(fs);

        return parseSummary(book)
            .then(function(resultBook) {
                var summary = resultBook.getSummary();
                var file = summary.getFile();

                expect(file.exists()).toBeFalsy();
            });
    });
});
