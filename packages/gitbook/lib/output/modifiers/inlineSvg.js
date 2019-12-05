var path = require('path');

var fs = require('../../utils/fs');
var LocationUtils = require('../../utils/location');

var editHTMLElement = require('./editHTMLElement');
var cheerio = require('cheerio');

/**
    Inline SVG images as needed

    @param {String} rootFolder
    @param {HTMLDom} $
    @return {Promise}
*/
function inlineSvg(rootFolder, currentFile, $) {
    var currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, 'img', function($img) {
        var src = $img.attr('src');
        if (path.extname(src) !== '.svg') {
            return;
        }

        // Calcul absolute path for this
        src = LocationUtils.toAbsolute(src, currentDirectory, '.');
        var inputPath = path.join(rootFolder, src);

        return fs.readFile(inputPath)
            .then(function(svgContext) {
                var $ = cheerio.load(svgContext, {xmlMode: true});
                const $svg = $('svg');
                if ($svg.attr('style')) { return; }
                $svg.attr('fill', 'currentColor');
                $img.replaceWith($svg);
            });
    });
}


module.exports = inlineSvg;
