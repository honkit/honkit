import Immutable from "immutable";
import File from "./file";
import Language from "./language";

class Languages extends Immutable.Record({
    file: new File(),
    list: Immutable.OrderedMap()
}) {
    getFile() {
        return this.get("file");
    }

    getList() {
        return this.get("list");
    }

    /**
     Get default languages

     @return {Language}
     */
    getDefaultLanguage(): Language {
        return this.getList().first();
    }

    /**
     Get a language by its ID

     @param {string} lang
     @return {Language}
     */
    getLanguage(lang: string): Language {
        return this.getList().get(lang);
    }

    /**
     Return count of langs

     @return {number}
     */
    getCount() {
        return this.getList().size;
    }

    /**
     Create a languages list from a JS object

     @return {Language}
     */

    static createFromList(file: File, langs: Languages): Languages {
        let list = Immutable.OrderedMap();

        langs.forEach((lang) => {
            lang = new Language({
                title: lang.title,
                path: lang.ref
            });
            list = list.set(lang.getID(), lang);
        });

        return new Languages({
            file: file,
            list: list
        });
    }
}

export default Languages;
