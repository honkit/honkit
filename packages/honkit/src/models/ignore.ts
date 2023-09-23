import Immutable from "immutable";
import createIgnore from "ignore";

/*
    Immutable version of node-ignore
*/
class Ignore extends Immutable.Record(
    {
        ignore: createIgnore()
    },
    "Ignore"
) {
    getIgnore() {
        return this.get("ignore");
    }

    /**
     Test if a file is ignored by these rules

     @return {boolean}
     * @param filename
     */
    isFileIgnored(filename: string) {
        const ignore = this.getIgnore();
        return ignore.filter([filename]).length == 0;
    }

    /**
     Add rules
     @param {string}
     @return {Ignore}
     */
    add(rule: string | import("ignore").Ignore) {
        const ignore = this.getIgnore();
        const newIgnore = createIgnore();

        newIgnore.add(ignore);
        newIgnore.add(rule);

        return this.set("ignore", newIgnore);
    }
}

export default Ignore;
