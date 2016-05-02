var _ = require('lodash');
var dom = require('./dom');

/**
    Parse an HTML content into a list of glossary entry

    @param {String} html
    @return {Array}
*/
function parseGlossary(html) {
    var $ = dom.parse(html);

    var entries = [];

    $('h2').each(function() {
        var $heading = $(this);
        var $next = $heading.next()
        var $p =  $next.is('p')? $next.first() : $next.find('p').first();

        var entry = {};

        entry.name = $heading.text();
        entry.description = $p.text();

        entries.push(entry);
    });

    return entries;
}

module.exports = parseGlossary;
