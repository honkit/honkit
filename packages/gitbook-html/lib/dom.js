var _ = require('lodash');
var cheerio = require('cheerio');

// Parse an HTML string and return its content
function parse(html) {
    var $ = cheerio.load(html);
    var $el = $('html, body').first();

    return $el.length > 0? $el : $;
}

// Return main element
function root($) {
    var $el = $('html, body, > div').first();
    return $el.length > 0? $el : $.root();
}

// Return text node of an element
function textNode($el) {
    return _.reduce($el.children, function(text, e) {
        if (e.type == 'text') text += e.data;
        return text;
    }, '');
}

// Cleanup a dom
// Remove all divs
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
