var asciidoctor = require('asciidoctor.js')();
var opal = asciidoctor.Opal;
var processor = asciidoctor.Asciidoctor();
var asciidocOpts = opal.hash2(['attributes'], {'attributes': 'showtitle'});

console.log(processor.$convert('= Test', asciidocOpts));