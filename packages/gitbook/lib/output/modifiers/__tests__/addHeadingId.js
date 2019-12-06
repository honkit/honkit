var cheerio = require('cheerio');
var addHeadingId = require('../addHeadingId');

describe('addHeadingId', () => {
    test('should add an ID if none', () => {
        var $ = cheerio.load('<h1>Hello World</h1><h2>Cool !!</h2>');

        return addHeadingId($)
            .then(function() {
                var html = $.html();
                expect(html).toBe('<h1 id="hello-world">Hello World</h1><h2 id="cool-">Cool !!</h2>');
            });
    });

    test('should not change existing IDs', () => {
        var $ = cheerio.load('<h1 id="awesome">Hello World</h1>');

        return addHeadingId($)
            .then(function() {
                var html = $.html();
                expect(html).toBe('<h1 id="awesome">Hello World</h1>');
            });
    });
});


