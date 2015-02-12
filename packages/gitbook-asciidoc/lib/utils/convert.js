var asciidoctor = require('asciidoctor.js')();
var opal = asciidoctor.Opal;

var processor = null;
var useExtensions = true;

if (useExtensions) {
    processor = asciidoctor.Asciidoctor(true);
} else {
    processor = asciidoctor.Asciidoctor();
}


var convert = function(content) {
    var options = opal.hash2(['attributes'], {'attributes': 'showtitle'});

    var html = processor.$convert(content, options);
    return html;
};

module.exports = convert;
