var asciidoctor = require('asciidoctor.js')();
var opal = asciidoctor.Opal;
var processor = asciidoctor.Asciidoctor(true);

// Render Asciidoc to HTML (block)
function asciidocToHTML(content) {
    var options = opal.hash2(['attributes'], {'attributes': 'showtitle'});

    var html = processor.$convert(content, options);
    return html;
};

// Render Asciidoc to HTML (inline)
function asciidocToHTMLInline(content) {
    var options = Opal.hash({doctype: 'inline', attributes: ['showtitle']});

    var html = processor.$convert(content, options);
    return html;
};

module.exports = {
    block: asciidocToHTML,
    inline: asciidocToHTMLInline
};
