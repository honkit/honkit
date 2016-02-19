var _ = require('lodash');
var dom = require('./dom');


// parse a ul list and return list of chapters recursvely
function parseList($ul, $) {
    var articles = [];

    $ul.children('>li').each(function() {
        var article = {};

        var $li = $(this);

        // Get text for the entry
        var $p = $li.children('> p');
        article.title = $p.text() ||  dom.textNode($li.get(0));

        // Parse link
        var $a = $li.find('> a, > p > a');
        if ($a.length > 0) {
            article.title = $a.first().text();
            article.path = $a.attr('href').replace(/\\/g, '/').replace(/^\/+/, '')
        }

        // Sub articles
        var $sub = $li.children('> .olist > ol, > ol, > ul');
        article.articles = parseList($sub, $);

        articles.push(article);
    });

    return articles;
}

// Return a list of entries in a div
function parseEntries (html) {
    var $ = dom.parse(html);
    var chapters = parseList($("> ol, > ul").first(), $);
    return chapters;
}

// HTML -> Summary
function parseSummary(src) {
    var chapters = parseEntries(src);

    return {
        chapters: chapters
    };
}

// Summary -> HTML
function summaryToText(summary) {
    var bl = '\n';

    var _base = function(article) {
        if (article.path) {
            return '<a href="'+article.path+'">'+article.title+'</a>';
        } else {
            return article.title;
        }
    };

    var convertArticle = function(article, d) {
        var content = Array(d+2).join(' ') + '<li>' + _base(article);

        if (article.articles.length > 0) {
            content += convertArticles(article.articles, d);
        }
        return content + '</li>' + bl;
    };

    var convertArticles = function(articles, d) {
        var content = '<ul>' + bl;
        _.each(articles, function(_article) {
            content += convertArticle(_article, d + 1);
        });
        return content + '<ul>' + bl;
    }

    return '<h1>Summary</h1>'+ bl+bl + convertArticles(summary.chapters, 0) + bl;
};


module.exports = parseSummary;
module.exports.entries = parseEntries;
module.exports.toText = summaryToText;
