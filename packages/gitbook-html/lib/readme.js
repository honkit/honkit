var _ = require('lodash');
var dom = require('./dom');

/**
    Parse an HTML content into metadata about a readme

    @param {String} html
    @return {Object}
*/
function parseReadme(html) {
    var $ = dom.parse(html);

    return {
        title: $('h1:first-child').text().trim(),
        description: $('div.paragraph,p').first().text().trim()
    };
}


// Exports
module.exports = parseReadme;
