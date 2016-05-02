var HTMLParser = require('gitbook-html');
var toHTML = require('./toHTML');
var toAsciidoc = require('./toAsciidoc');

module.exports = HTMLParser.createParser(toHTML, toAsciidoc);
