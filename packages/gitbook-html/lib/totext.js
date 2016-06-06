var _ = require('lodash');

/*
    This class is extended by gitbook-markdown and gitbook-asciidoc
    to generate back markdown/asciidoc from GitBook metadata.
*/


function ToText(markup) {
    if (!(this instanceof ToText)) {
        return new ToText(markup);
    }

    _.extend(this, markup || {});
    _.bindAll(this, _.functionsIn(this));
};

// Break line
ToText.prototype.onBL = function() {
    return '\n';
};

ToText.prototype.onText = function(text) {
    return text;
};

ToText.prototype.onHR = function() {
    return '<hr />';
};

// ---- TITLES

ToText.prototype.onTitleStart = function(level) {
    return '<h'+level+'>';
};
ToText.prototype.onTitleEnd = function(level) {
    return '</h'+level+'>';
};

// ---- PARAGRAPHS / SECTIONS
ToText.prototype.onParagraphStart = function() {
    return '<p>';
};
ToText.prototype.onParagraphEnd = function() {
    return '</p>';
};


ToText.prototype.onSection = function() {
    return this.onBL();
};

// ---- LINKS
ToText.prototype.onLinkStart = function(href) {
    return '<a href="' + href + '">';
};
ToText.prototype.onLinkEnd = function(href) {
    return '</a>';
};

// ---- LISTS
ToText.prototype.onListItemStart = function(level) {
    return this._spaces((level + 1) * 4) + '<li>';
};
ToText.prototype.onListItemEnd = function(level) {
    return this._spaces((level + 1) * 4) + '</li>' + this.onBL();
};
ToText.prototype.onListStart = function(level) {
    return this._spaces(level * 4) + '<ul>' + this.onBL();
};
ToText.prototype.onListEnd = function(level) {
    return this._spaces(level * 4) + '</ul>' + this.onBL();
};

// ------ LANGS

ToText.prototype.langs = function(languages) {
    var content = '';
    content += this.onTitleStart(1) + this.onText('Languages') + this.onTitleEnd(1);
    content += this.onSection();

    content += this._summaryArticles(languages);

    return content;
};

// ------ GLOSSARY

ToText.prototype.glossary = function(glossary) {
    var that = this;
    var content = '';

    content += that.onTitleStart(1) + that.onText('Glossary') + that.onTitleEnd(1);
    content += that.onSection();

    _.each(glossary, function(entry) {
        content += that.onTitleStart(2) + that.onText(entry.name) + that.onTitleEnd(2);
        content += that.onParagraphStart();
        content += that.onText(entry.description);
        content += that.onParagraphEnd();
        content += that.onSection();
    });

    return content;
};

// ------ SUMMARY

ToText.prototype._summaryArticle = function(article, level) {
    var content = '';

    content += this.onListItemStart(level);

    if (article.ref) content += this.onLinkStart(article.ref)
    content += this.onText(article.title)
    if (article.ref) content += this.onLinkEnd(article.ref);
    content += this.onBL();

    if (article.articles && article.articles.length > 0) {
        content += this._summaryArticles(article.articles, level + 1);
    }

    content += this.onListItemEnd(level);

    return content;
};
ToText.prototype._summaryArticles = function(articles, level) {
    var that = this;
    var content = '';

    level = level || 0;

    content += that.onListStart(level);
    _.each(articles, function(article) {
        content += that._summaryArticle(article, level);
    });
    content += that.onListEnd(level);

    return content;
};
ToText.prototype._summaryPart = function(part) {
    var content = '';

    if (part.title) content += this.onTitleStart(2) + this.onText(part.title) + this.onTitleEnd(2);

    content += this._summaryArticles(part.articles);

    return content;
};

ToText.prototype.summary = function(summary) {
    var that = this;
    var content = '';

    content += that.onTitleStart(1) + that.onText('Summary') + that.onTitleEnd(1);
    content += that.onSection();

    _.each(summary.parts, function(part, i) {
        var next = summary.parts[i + 1];

        content += that._summaryPart(part);

        if (next && !next.title) {
            content += that.onBL() + that.onHR() + that.onBL();
        } else {
            content += that.onSection();
        }

    });

    return content;
};

// ---- Utilities

ToText.prototype._spaces =  function(n, s) {
    return Array(n + 1).join(s || ' ');
}

module.exports = ToText;

