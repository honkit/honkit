import Immutable from "immutable";
import error from "../utils/error";
import File from "./file";
import GlossaryEntry from "./glossaryEntry";
import parsers from "../parsers";

class Glossary extends Immutable.Record({
    file: new File(),
    entries: Immutable.OrderedMap(),
}) {
    getFile() {
        return this.get("file");
    }

    getEntries() {
        return this.get("entries");
    }

    /**
     Return an entry by its name
     @param {string} name
     @return {GlossaryEntry}
     */
    getEntry(name: string) {
        const entries = this.getEntries();

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'nameToID' does not exist on type 'Class'... Remove this comment to see the full error message
        const id = GlossaryEntry.nameToID(name);

        return entries.get(id);
    }

    /**
     Render glossary as text

     @return {Promise<String>}
     */
    toText(parser) {
        const file = this.getFile();
        const entries = this.getEntries();

        parser = parser ? parsers.getByExt(parser) : file.getParser();

        if (!parser) {
            throw error.FileNotParsableError({
                filename: file.getPath(),
            });
        }

        return parser.renderGlossary(entries.toJS());
    }

    /**
     Add/Replace an entry to a glossary

     @param {Glossary} glossary
     @param {GlossaryEntry} entry
     @return {Glossary}
     */
    static addEntry(glossary: Glossary, entry) {
        const id = entry.getID();
        let entries = glossary.getEntries();

        entries = entries.set(id, entry);
        return glossary.set("entries", entries);
    }

    /**
     Add/Replace an entry to a glossary by name/description

     @param {Glossary} glossary
     @param {GlossaryEntry} entry
     @return {Glossary}
     */
    static addEntryByName(glossary, name, description) {
        const entry = new GlossaryEntry({
            name: name,
            description: description,
        });
        return Glossary.addEntry(glossary, entry);
    }

    /**
     Create a glossary from a list of entries

     @param {string} filename
     @param {Array|List} entries
     @return {Glossary}
     */
    static createFromEntries(file, entries) {
        entries = entries.map((entry) => {
            if (!(entry instanceof GlossaryEntry)) {
                entry = new GlossaryEntry(entry);
            }

            return [entry.getID(), entry];
        });

        return new Glossary({
            file: file,
            entries: Immutable.OrderedMap(entries),
        });
    }
}

export default Glossary;
