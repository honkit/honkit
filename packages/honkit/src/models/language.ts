import path from "path";
import Immutable from "immutable";

class Language extends Immutable.Record({
    title: String(),
    path: String()
}) {
    getTitle(): string {
        return this.get("title");
    }

    getPath(): string {
        return this.get("path");
    }

    getID(): string {
        return path.basename(this.getPath());
    }
}

export default Language;
