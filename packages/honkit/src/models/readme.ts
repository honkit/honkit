import Immutable from "immutable";
import File from "./file";

class Readme extends Immutable.Record({
    file: new File(),
    title: String(),
    description: String()
}) {
    getFile(): File {
        return this.get("file");
    }

    getTitle(): string {
        return this.get("title");
    }

    getDescription(): string {
        return this.get("description");
    }

    /**
     Create a new readme

     @param {File} file
     @param {Object} def
     @return {Readme}
     */
    static create(file: File, def: { title?: any; description?: any }) {
        def = def || {};

        return new Readme({
            file: file,
            title: def.title || "",
            description: def.description || ""
        });
    }
}

export default Readme;
