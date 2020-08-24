import Immutable from "immutable";
import error from "../utils/error";
import File from "./file";
import GlossaryEntry from "./glossaryEntry";
import parsers from "../parsers";

const Glossary = Immutable.Record({
    file: File(),
    entries: Immutable.OrderedMap(),
});

Glossary.prototype.getFile = function () {
    return this.get("file");
};

Glossary.prototype.getEntries = function () {
    return this.get("entries");
};

/**
 Return an entry by its name

 @param {String} name
 @return {GlossaryEntry}
 */
Glossary.prototype.getEntry = function (name) {
    const entries = this.getEntries();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nameToID' does not exist on type 'Class'... Remove this comment to see the full error message
    const id = GlossaryEntry.nameToID(name);

    return entries.get(id);
};

/**
 Render glossary as text

 @return {Promise<String>}
 */
Glossary.prototype.toText = function (parser) {
    const file = this.getFile();
    const entries = this.getEntries();

    parser = parser ? parsers.getByExt(parser) : file.getParser();

    if (!parser) {
        throw error.FileNotParsableError({
            filename: file.getPath(),
        });
    }

    return parser.renderGlossary(entries.toJS());
};

/**
 Add/Replace an entry to a glossary

 @param {Glossary} glossary
 @param {GlossaryEntry} entry
 @return {Glossary}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'addEntry' does not exist on type 'Class'... Remove this comment to see the full error message
Glossary.addEntry = function addEntry(glossary, entry) {
    const id = entry.getID();
    let entries = glossary.getEntries();

    entries = entries.set(id, entry);
    return glossary.set("entries", entries);
};

/**
 Add/Replace an entry to a glossary by name/description

 @param {Glossary} glossary
 @param {GlossaryEntry} entry
 @return {Glossary}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'addEntryByName' does not exist on type '... Remove this comment to see the full error message
Glossary.addEntryByName = function addEntryByName(glossary, name, description) {
    const entry = new GlossaryEntry({
        name: name,
        description: description,
    });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'addEntry' does not exist on type 'Class'... Remove this comment to see the full error message
    return Glossary.addEntry(glossary, entry);
};

/**
 Create a glossary from a list of entries

 @param {String} filename
 @param {Array|List} entries
 @return {Glossary}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromEntries' does not exist on typ... Remove this comment to see the full error message
Glossary.createFromEntries = function createFromEntries(file, entries) {
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
};

export default Glossary;
