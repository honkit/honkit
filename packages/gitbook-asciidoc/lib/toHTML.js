var asciidoctor = require('asciidoctor.js')();

// Render Asciidoc to HTML (block)
function asciidocToHTML(content) {
    return asciidoctor.convert(content, {'attributes': 'showtitle'});
};

// Render Asciidoc to HTML (inline)
function asciidocToHTMLInline(content) {
    return asciidoctor.convert(content, {doctype: 'inline', attributes: 'showtitle'});
};

module.exports = {
    block: asciidocToHTML,
    inline: asciidocToHTMLInline
};
