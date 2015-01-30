var _ = require('lodash');
var cheerio = require('cheerio');

var convert = require('./utils/convert');

function parseReadme(src) {
    var html = convert(src);
    var $ = cheerio.load(html);

    return {
        title: $("h1:first-child").text().trim(),
        description: $("div.paragraph").first().text().trim()
    };
}


// Exports
module.exports = parseReadme;
