var _ = require('lodash');
var dom = require('./dom');

var SELECTOR_LIST = 'ol, ul';
var SELECTOR_LINK = '> a, p > a';
var SELECTOR_PART = 'h2, h3, h4';

var BL = '\n';

/**
    Find a list

    @param {cheerio.Node}
    @return {cheerio.Node}
*/
function findList($parent) {
    var $container = $parent.children('.olist');
    if ($container.length > 0) $parent = $container.first();

    return $parent.children(SELECTOR_LIST);
}

/**
    Parse a ul list and return list of chapters recursvely

    @param {cheerio.Node}
    @param {cheerio.DOM}
    @return {Array}
*/
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
            article.ref = $a.attr('href').replace(/\\/g, '/').replace(/^\/+/, '');
        }

        // Sub articles
        var $sub = findList($li);
        article.articles = parseList($sub, $);

        if (!article.title) return;
        articles.push(article);
    });

    return articles;
}

/**
     Find all parts and their corresponding lists

     @param {cheerio.Node}
     @param {cheerio.DOM}
     @return {Array<{title: String, list: cheerio.Node}>}
 */
function findParts($parent, $) {
    // Find parts and lists
    // TODO asciidoc compatibility
    var partsAndLists = $parent.children(SELECTOR_LIST + ', ' + SELECTOR_PART);

    // Group each part with the list after
    var parts = [];
    var previousPart = null;

    partsAndLists.each(function (i, el) {
        if (isPartNode(el)) {
            if (previousPart !== null) {
                // The previous part was empty
                parts.push(previousPart);
            }
            previousPart = {
                title: getPartTitle(el, $),
                list: null
            };

        } else { // It is a list
            if (previousPart !== null) {
                previousPart.list = el;
            } else {
                previousPart = {
                    title: '',
                    list: el
                };
            }
            parts.push(previousPart);
            previousPart = null;
        }
    });

    // Last part might be empty
    if (previousPart !== null) {
        parts.push(previousPart);
    }

    return parts;
}

/**
    True if the element is a part

    @param el
    @return {Boolean}
 */
function isPartNode(el) {
    return SELECTOR_PART.indexOf(el.name) !== -1;
}

/**
    Parse the title of a part element

    @param el
    @param {cheerio.DOM} $
    @return {String}
 */
function getPartTitle(el, $) {
    return $(el).text().trim();
}

/**
    Parse an HTML content into a tree of articles/parts

    @param {String} html
    @return {Object}
*/
function parseSummary(html) {
    var $ = dom.parse(html);
    var $root = dom.cleanup(dom.root($), $);

    var parts = findParts($root, $);

    // Parse each list
    var parsedParts = [];
    var part;
    for (var i = 0; i < parts.length; ++i) {
        part = parts[i];
        parsedParts.push({
            title: part.title,
            articles: parseList($(part.list), $)
        });
    }

    return {
        parts: parsedParts
    };
}

module.exports = parseSummary;
