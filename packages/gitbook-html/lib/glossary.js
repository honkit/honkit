var _ = require('lodash');
var dom = require('./dom');

// HTML -> Glossary
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

// Glossary -> HTML
function glossaryToText(glossary) {
    var bl = '\n';

    var body = _.map(glossary, function(entry) {
        return '<h2>' + entry.name + '</h2>' + bl + bl
        + '<p>' + entry.description + '</p>';
    }).join(bl+bl);

    return '<h1>Glossary</h1>'+bl+bl+body;
}

module.exports = parseGlossary;
module.exports.toText = glossaryToText;
