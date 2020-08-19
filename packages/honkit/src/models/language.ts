// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Language'.
const Language = Immutable.Record({
    title: String(),
    path: String(),
});

Language.prototype.getTitle = function () {
    return this.get("title");
};

Language.prototype.getPath = function () {
    return this.get("path");
};

Language.prototype.getID = function () {
    return path.basename(this.getPath());
};

module.exports = Language;
