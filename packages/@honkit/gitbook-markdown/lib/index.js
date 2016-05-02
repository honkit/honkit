var HTMLParser = require('gitbook-html');

var toHTML = require('./toHTML');
var toMarkdown = require('./toMarkdown');
var page = require('./page');

module.exports = HTMLParser.createParser(toHTML, toMarkdown);

// Add the custom page escaping
module.exports.page.prepare = page.prepare;
