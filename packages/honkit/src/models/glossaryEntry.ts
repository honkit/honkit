import Immutable from "immutable";
import slug from "github-slugid";

/*
    A definition represents an entry in the glossary
*/

class GlossaryEntry extends Immutable.Record({
    name: String(),
    description: String()
}) {
    getName(): string {
        return this.get("name");
    }

    getDescription(): string {
        return this.get("description");
    }

    /**
     Get identifier for this entry
     */
    getID(): string {
        return GlossaryEntry.nameToID(this.getName());
    }

    /**
     Normalize a glossary entry name into a unique id
     */
    static nameToID(name: string): string {
        return slug(name);
    }
}

export default GlossaryEntry;
