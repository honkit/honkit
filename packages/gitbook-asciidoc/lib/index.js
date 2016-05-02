var HTMLParser = require('gitbook-html');
var toHTML = require('./tohtml');
var toAsciidoc = require('./toasciidoc');

module.exports = HTMLParser.createParser(toHTML, toAsciidoc);
