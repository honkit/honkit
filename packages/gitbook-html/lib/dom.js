var _ = require('lodash');
var cheerio = require('cheerio');

/**
    Parse an HTML string and return its content

    @param {String}
    @return {cheerio.DOM}
*/
function parse(html) {
    var $ = cheerio.load(html);
    var $el = $('html, body').first();

    return $el.length > 0? $el : $;
}

/**
    Return main element for a DOM

    @param {cheerio.DOM}
    @return {cheerio.Node}
*/
function root($) {
    var $el = $('html, body, > div').first();
    return $el.length > 0? $el : $.root();
}

/**
    Return text node of an element

    @param {cheerio.Node}
    @return {String}
*/
function textNode($el) {
    return _.reduce($el.children, function(text, e) {
        if (e.type == 'text') text += e.data;
        return text;
    }, '');
}

/**
    Cleanup a DOM by removing all useless divs

    @param {cheerio.Node}
    @param {cheerio.DOM}
    @return {cheerio.Node}
*/
function cleanup($el, $) {
    $el.find('div').each(function() {
        var $div = $(this);
        cleanup($div, $);

        $div.replaceWith($div.html());
    });

    return $el;
}

module.exports = {
    parse: parse,
    textNode: textNode,
    root: root,
    cleanup: cleanup
};
