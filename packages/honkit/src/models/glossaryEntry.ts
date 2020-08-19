// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'slug'.
const slug = require("github-slugid");

/*
    A definition represents an entry in the glossary
*/

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'GlossaryEn... Remove this comment to see the full error message
const GlossaryEntry = Immutable.Record({
    name: String(),
    description: String(),
});

GlossaryEntry.prototype.getName = function () {
    return this.get("name");
};

GlossaryEntry.prototype.getDescription = function () {
    return this.get("description");
};

/**
    Get identifier for this entry

    @retrun {Boolean}
*/
GlossaryEntry.prototype.getID = function () {
    return GlossaryEntry.nameToID(this.getName());
};

/**
    Normalize a glossary entry name into a unique id

    @param {String}
    @return {String}
*/
GlossaryEntry.nameToID = function nameToID(name) {
    return slug(name);
};

module.exports = GlossaryEntry;
