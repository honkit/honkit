var asciidoctor = require('asciidoctor.js')();
var opal = asciidoctor.Opal;
var processor = asciidoctor.Asciidoctor(true);


function asciidocToHTML(content) {
    var options = opal.hash2(['attributes'], {'attributes': 'showtitle'});

    var html = processor.$convert(content, options);
    return html;
};

module.exports = asciidocToHTML;
