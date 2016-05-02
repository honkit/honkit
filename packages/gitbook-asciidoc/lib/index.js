var HTMLParser = require('gitbook-html');
var toHTML = require('./toHTML');
var toAsciidoc = require('./toasciidoc');

module.exports = HTMLParser.createParser(toHTML, toAsciidoc);
