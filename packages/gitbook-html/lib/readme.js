var _ = require('lodash');
var dom = require('./dom');

// HTML -> Readme
function parseReadme(html) {
    var $ = dom.parse(html);

    return {
        title: $('h1:first-child').text().trim(),
        description: $('div.paragraph,p').first().text().trim()
    };
}


// Exports
module.exports = parseReadme;
