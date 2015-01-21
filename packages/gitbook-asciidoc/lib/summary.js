var _ = require('lodash');
var cheerio = require('cheerio');

var convert = require('./utils/convert');

function parseSummary(src, entryPoint) {
    var html = convert(src);
    $ = cheerio.load(html);
    console.log(html);
    return [];
}

function parseEntries (src) {
    return [];
}


// Exports
module.exports = parseSummary;
module.exports.entries = parseEntries;
