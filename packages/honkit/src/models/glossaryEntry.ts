import Immutable from "immutable";
import slug from "github-slugid";

/*
    A definition represents an entry in the glossary
*/

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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nameToID' does not exist on type 'Class'... Remove this comment to see the full error message
    return GlossaryEntry.nameToID(this.getName());
};

/**
 Normalize a glossary entry name into a unique id

 @param {String}
 @return {String}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'nameToID' does not exist on type 'Class'... Remove this comment to see the full error message
GlossaryEntry.nameToID = function nameToID(name) {
    return slug(name);
};

export default GlossaryEntry;
