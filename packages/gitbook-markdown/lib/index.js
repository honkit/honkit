var htmlParser = require('gitbook-html');

var toHTML = require('./tohtml');
var toMarkdown = require('./tomarkdown');
var page = require('./page');

module.exports = htmlParser.createParser(toHTML, toMarkdown);
module.exports.page.prepare = page.prepare;
