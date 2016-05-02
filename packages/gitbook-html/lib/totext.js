var _ = require('lodash');

function ToText(markup) {
    _.extend(this, markup || {});
    _.bindAll(this);
};

// Break line
ToText.prototype.onBL = function() {
    return '\n';
};

ToText.prototype.onText = function(text) {
    return text;
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
    var content = '';
    content += this.onTitleStart(1) + this.onText('Glossary') + this.onTitleEnd(1);
    content += this.onSection();

    _.each(glossary, function(entry) {
        content += this.onTitleStart(2) + this.onText(entry.name) + this.onTitleEnd(2);
        content += this.onParagraphStart();
        content += this.onText(entry.description);
        content += this.onParagraphEnd();
        content += this.onSection();
    }, this);

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
    var content = '';
    level = level || 0;

    content += this.onListStart(level);
    _.each(articles, function(article) {
        content += this._summaryArticle(article, level);
    }, this);
    content += this.onListEnd(level);

    return content;
};
ToText.prototype._summaryPart = function(part) {
    var content = '';

    if (part.title) content += this.onTitleStart(2) + this.onText(part.title) + this.onTitleEnd(2);

    content += this._summaryArticles(part.articles);
    content += this.onSection();

    return content;
};

ToText.prototype.summary = function(summary) {
    var content = '';
    content += this.onTitleStart(1) + this.onText('Summary') + this.onTitleEnd(1);
    content += this.onSection();

    _.each(summary.parts, function(part) {
        content += this._summaryPart(part);
    }, this);

    return content;
};

// ---- Utilities

ToText.prototype._spaces =  function(n, s) {
    return Array(n + 1).join(s || ' ');
}

module.exports = ToText;

