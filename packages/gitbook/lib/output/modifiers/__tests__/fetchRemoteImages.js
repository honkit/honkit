var cheerio = require('cheerio');
var tmp = require('tmp');
var path = require('path');

var URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png';

describe('fetchRemoteImages', () => {
    var dir;
    var fetchRemoteImages = require('../fetchRemoteImages');

    beforeEach(() => {
        dir = tmp.dirSync();
    });

    test('should download image file', () => {
        var $ = cheerio.load('<img src="' + URL + '" />');

        return fetchRemoteImages(dir.name, 'index.html', $)
            .then(function() {
                var $img = $('img');
                var src = $img.attr('src');

                expect(dir.name).toHaveFile(src);
            });
    });

    test('should download image file and replace with relative path', () => {
        var $ = cheerio.load('<img src="' + URL + '" />');

        return fetchRemoteImages(dir.name, 'test/index.html', $)
            .then(function() {
                var $img = $('img');
                var src = $img.attr('src');

                expect(dir.name).toHaveFile(path.join('test', src));
            });
    });
});
