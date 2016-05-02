
// Return N time a string
function ns(s, n) {
    return Array(n + 1).join(s);
}

/*
    This module provides markup rules for gitbook-html
    These rules are being used to generate SUMMARY/GLOSSARY/LANGS
*/
module.exports = {
    onTitleStart: function(level) {
        return ns('#', level) + ' ';
    },
    onTitleEnd: function(level) {
        return this.onBL();
    },

    onParagraphStart: function() {
        return this.onSection();
    },
    onParagraphEnd: function() {
        return this.onSection();
    },

    onLinkStart: function() {
        return '[';
    },
    onLinkEnd: function(href) {
        return '](' + href +')';
    },

    onListStart: function(level) {
        return '';
    },
    onListEnd: function() {
        return '';
    },

    onListItemStart: function(level) {
        return ns(' ', level * 4) + '* ';
    },
    onListItemEnd: function() {
        return '';
    },

    onHR: function() {
        return '-----';
    }
};

