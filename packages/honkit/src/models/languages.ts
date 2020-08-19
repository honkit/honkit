// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'File'.
const File = require("./file");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Language'.
const Language = require("./language");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Languages'... Remove this comment to see the full error message
const Languages = Immutable.Record({
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type '{ new (fileBits: BlobPart[], fileNa... Remove this comment to see the full error message
    file: File(),
    list: Immutable.OrderedMap(),
});

Languages.prototype.getFile = function () {
    return this.get("file");
};

Languages.prototype.getList = function () {
    return this.get("list");
};

/**
    Get default languages

    @return {Language}
*/
Languages.prototype.getDefaultLanguage = function () {
    return this.getList().first();
};

/**
    Get a language by its ID

    @param {String} lang
    @return {Language}
*/
Languages.prototype.getLanguage = function (lang) {
    return this.getList().get(lang);
};

/**
    Return count of langs

    @return {Number}
*/
Languages.prototype.getCount = function () {
    return this.getList().size;
};

/**
    Create a languages list from a JS object

    @param {File}
    @param {Array}
    @return {Language}
*/
Languages.createFromList = function (file, langs) {
    let list = Immutable.OrderedMap();

    langs.forEach((lang) => {
        lang = Language({
            title: lang.title,
            path: lang.ref,
        });
        list = list.set(lang.getID(), lang);
    });

    return Languages({
        file: file,
        list: list,
    });
};

module.exports = Languages;
