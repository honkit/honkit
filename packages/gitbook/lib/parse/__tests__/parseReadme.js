var Promise = require('../../utils/promise');
var Book = require('../../models/book');
var createMockFS = require('../../fs/mock');

describe('parseReadme', () => {
    var parseReadme = require('../parseReadme');

    test('should parse summary if exists', () => {
        var fs = createMockFS({
            'README.md': '# Hello\n\nAnd here is the description.'
        });
        var book = Book.createForFS(fs);

        return parseReadme(book)
            .then(function(resultBook) {
                var readme = resultBook.getReadme();
                var file = readme.getFile();

                expect(file.exists()).toBeTruthy();
                expect(readme.getTitle()).toBe('Hello');
                expect(readme.getDescription()).toBe('And here is the description.');
            });
    });

    test('should fail if doesn\'t exist', () => {
        var fs = createMockFS({});
        var book = Book.createForFS(fs);

        return parseReadme(book)
            .then(function(resultBook) {
                throw new Error('It should have fail');
            }, function() {
                return Promise();
            });
    });
});
