var _ = require('lodash');
var cheerio = require('cheerio');

// Parse an HTML string and return its content
function parse(html) {
    var $ = cheerio.load('<div>'+html+'</div>');
    var $el = $('html, body').first();

    return $el.length > 0? $el : $;
}

// Return text node of an element
function textNode($el) {
    return _.reduce($el.children, function(text, e) {
        if (e.type == 'text') text += e.data;
        return text;
    }, '');
}

module.exports = {
    parse: parse,
    textNode: textNode
};
