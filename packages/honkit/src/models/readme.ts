// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'File'.
const File = require("./file");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Readme'.
const Readme = Immutable.Record({
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type '{ new (fileBits: BlobPart[], fileNa... Remove this comment to see the full error message
    file: File(),
    title: String(),
    description: String(),
});

Readme.prototype.getFile = function () {
    return this.get("file");
};

Readme.prototype.getTitle = function () {
    return this.get("title");
};

Readme.prototype.getDescription = function () {
    return this.get("description");
};

/**
    Create a new readme

    @param {File} file
    @param {Object} def
    @return {Readme}
*/
Readme.create = function (file, def) {
    def = def || {};

    return new Readme({
        file: file,
        title: def.title || "",
        description: def.description || "",
    });
};

module.exports = Readme;
