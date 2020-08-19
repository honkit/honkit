// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parsers'.
const parsers = require("../parsers");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'File'.
const File = Immutable.Record({
    // Path of the file, relative to the FS
    path: String(),

    // Time when file data last modified
    mtime: Date(),
});

// @ts-expect-error ts-migrate(2339) FIXME: Property 'getPath' does not exist on type 'File'.
File.prototype.getPath = function () {
    return this.get("path");
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'getMTime' does not exist on type 'File'.
File.prototype.getMTime = function () {
    return this.get("mtime");
};

/**
    Does the file exists / is set

    @return {Boolean}
*/
// @ts-expect-error ts-migrate(2339) FIXME: Property 'exists' does not exist on type 'File'.
File.prototype.exists = function () {
    return Boolean(this.getPath());
};

/**
    Return type of file ('markdown' or 'asciidoc')

    @return {String}
*/
// @ts-expect-error ts-migrate(2339) FIXME: Property 'getType' does not exist on type 'File'.
File.prototype.getType = function () {
    const parser = this.getParser();
    if (parser) {
        return parser.getName();
    } else {
        return undefined;
    }
};

/**
    Return extension of this file (lowercased)

    @return {String}
*/
// @ts-expect-error ts-migrate(2339) FIXME: Property 'getExtension' does not exist on type 'Fi... Remove this comment to see the full error message
File.prototype.getExtension = function () {
    return path.extname(this.getPath()).toLowerCase();
};

/**
    Return parser for this file

    @return {Parser}
*/
// @ts-expect-error ts-migrate(2339) FIXME: Property 'getParser' does not exist on type 'File'... Remove this comment to see the full error message
File.prototype.getParser = function () {
    return parsers.getByExt(this.getExtension());
};

/**
    Create a file from stats informations

    @param {String} filepath
    @param {Object|fs.Stats} stat
    @return {File}
*/
// @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromStat' does not exist on type '... Remove this comment to see the full error message
File.createFromStat = function createFromStat(filepath, stat) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
    return new File({
        path: filepath,
        mtime: stat.mtime,
    });
};

/**
    Create a file with only a path

    @param {String} filepath
    @return {File}
*/
// @ts-expect-error ts-migrate(2339) FIXME: Property 'createWithFilepath' does not exist on ty... Remove this comment to see the full error message
File.createWithFilepath = function createWithFilepath(filepath) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
    return new File({
        path: filepath,
    });
};

module.exports = File;
