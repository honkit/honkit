var _ = require('lodash');
var cheerio = require('cheerio');

var convert = require('./utils/convert');


// parse a ul list and return list of chapters recursvely
function parseList($ul, $) {
	var articles = [];

	$ul.children("li").each(function() {
		var article = {};

		var $li = $(this);
		var $p = $li.children("p");

		article.title = $p.text();

		// Parse link
		var $a = $p.children("a");
		if ($a.length > 0) {
			article.title = $a.first().text();
			article.path = $a.attr("href").replace(/\\/g, '/').replace(/^\/+/, '')
		}

		// Sub articles
		var $sub = $li.children(".olist").children("ol");
		article.articles = parseList($sub, $);

		articles.push(article);
	});

	return articles;
}

function defaultChapterList(chapterList, entryPoint) {
    var first = _.first(chapterList);

    // Check if introduction node was specified in SUMMARY.md
    if (first && first.path == entryPoint) {
        return chapterList;
    }

    // It wasn't specified, so add in default
    return [
        {
        	path: entryPoint,
        	title: 'Introduction'
        }
    ].concat(chapterList);
}

function parseSummary(src, entryPoint) {
	entryPoint = entryPoint || "README.adoc";

    var chapters = parseEntries(src);
    chapters = defaultChapterList(chapters, entryPoint);

    return {
    	chapters: chapters
    };
}

function parseEntries (src) {
    var html = convert(src);
    $ = cheerio.load(html);

    var chapters = parseList($("ol").first(), $);
    return chapters;
}


// Exports
module.exports = parseSummary;
module.exports.entries = parseEntries;
