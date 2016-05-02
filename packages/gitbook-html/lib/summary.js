var _ = require('lodash');
var dom = require('./dom');

var SELECTOR_LIST = 'ol, ul';
var SELECTOR_LINK = '> a, p > a';

var BL = '\n';

// Find a list
function findList($parent) {
    var $container = $parent.children('.olist');
    if ($container.length > 0) $parent = $container.first();

    return $parent.children('ul, ol');
}

// Parse a ul list and return list of chapters recursvely
function parseList($ul, $) {
    var articles = [];

    $ul.children('li').each(function() {
        var article = {};
        var $li = $(this);

        // Get text for the entry
        var $p = $li.children('p');
        article.title = ($p.text() ||  dom.textNode($li.get(0))).trim();

        // Parse link
        var $a = $li.find(SELECTOR_LINK);
        if ($a.length > 0) {
            article.title = $a.first().text();
            article.ref = $a.attr('href').replace(/\\/g, '/').replace(/^\/+/, '')
        }

        // Sub articles
        var $sub = findList($li);
        article.articles = parseList($sub, $);

        if (!article.title) return;
        articles.push(article);
    });

    return articles;
}

// HTML -> Summary
function parseSummary(html) {
    var $ = dom.parse(html);
    var $root = dom.cleanup(dom.root($), $);

    var $lists = findList($root);
    var parts = [];

    $lists.each(function() {
        var $list = $(this);
        var $title = $list.prevUntil(SELECTOR_LIST, 'h2, h3, h4').first();

        parts.push({
            title: $title.text().trim(),
            articles: parseList($list, $)
        });
    });

    return {
        parts: parts
    };
}

module.exports = parseSummary;
