var cheerio = require('cheerio');
var tmp = require('tmp');

describe('svgToImg', () => {
    var dir;
    var svgToImg = require('../svgToImg');

    beforeEach(() => {
        dir = tmp.dirSync();
    });

    test('should write svg as a file', () => {
        var $ = cheerio.load('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" version="1.1"><rect width="200" height="100" stroke="black" stroke-width="6" fill="green"/></svg>');

        return svgToImg(dir.name, 'index.html', $)
            .then(() => {
                var $img = $('img');
                var src = $img.attr('src');

                expect(dir.name).toHaveFile(src);
            });
    });

    it('should not write icon svg as a file', function() {
        var $ = cheerio.load('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" version="1.1" fill="currentColor"><rect width="200" height="100" stroke-width="6"/></svg>');

        return svgToImg(dir.name, 'index.html', $)
            .then(function() {
                expect($.contains('img')).toBe(false);
            });
    });
});
