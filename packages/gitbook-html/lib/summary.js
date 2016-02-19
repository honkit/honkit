var _ = require('lodash');
var dom = require('./dom');

var SELECTOR_LIST = '.olist > ol, ol, ul';
var SELECTOR_LINK = 'a, p > a';

var BL = '\n';

// parse a ul list and return list of chapters recursvely
function parseList($ul, $) {
    var articles = [];

    $ul.children('li').each(function() {
        var article = {};
        var $li = $(this);

        // Get text for the entry
        var $p = $li.children('> p');
        article.title = $p.text() ||  dom.textNode($li.get(0));

        // Parse link
        var $a = $li.children(SELECTOR_LINK);
        if ($a.length > 0) {
            article.title = $a.first().text();
            article.path = $a.attr('href').replace(/\\/g, '/').replace(/^\/+/, '')
        }

        // Sub articles
        var $sub = $li.children(SELECTOR_LIST).first();
        article.articles = parseList($sub, $);

        articles.push(article);
    });

    return articles;
}

// HTML -> Summary
function parseSummary(html) {
    var $ = dom.parse(html);
    var $root = dom.root($);

    var $lists = $root.children(SELECTOR_LIST);
    var parts = [];

    $lists.each(function() {
        var $list = $(this);

        parts.push({
            articles: parseList($(SELECTOR_LIST).first(), $)
        });
    });

    return {
        parts: parts
    };
}

// Summary -> HTML
function textPrefix(d) {
    return Array(d*4).join(' ');
}

function articleToText(article, d) {
    var prefix = textPrefix(d);
    var content = prefix + '<li>';

    if (article.path) {
        content += '<a href="'+article.path+'">'+article.title+'</a>';
    } else {
        content += article.title;
    }

    if (article.articles.length > 0) {
        content += BL + articlesToText(article.articles, d) + prefix;
    }
    content +=  '</li>' + BL;

    return content;
}

function articlesToText(articles, d) {
    var prefix = textPrefix(d);
    var content = prefix + '<ul>' + BL;
    _.each(articles, function(_article) {
        content += articleToText(_article, d + 1);
    });
    return content + '</ul>' + BL;
}

function partsToText(part) {
    return articlesToText(part.articles, 0) + BL + BL;
}

function summaryToText(summary) {
    var content = '<h1>Summary</h1>' + BL;

    _.each(summary.parts, function(part) {
        content += partsToText(part);
    });

    return content + BL;
};


module.exports = parseSummary;
module.exports.toText = summaryToText;
