var _ = require('lodash');
var cheerio = require('cheerio');

var convert = require('./utils/convert');

function parseGlossary(src) {
	var html = convert(src);
    var $ = cheerio.load(html);

    var entries = [];

    $("h2").each(function() {
    	var $h2 = $(this);
        var $p = $h2.next().find("p");

    	var entry = {};

    	entry.name = $h2.text();
        entry.description = $p.text();

    	entries.push(entry);
    });

    return entries;
}

module.exports = parseGlossary;
