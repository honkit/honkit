import Immutable from "immutable";
import createIgnore from "ignore";

/*
    Immutable version of node-ignore
*/

const Ignore = Immutable.Record(
    {
        ignore: createIgnore(),
    },
    "Ignore"
);

Ignore.prototype.getIgnore = function () {
    return this.get("ignore");
};

/**
 Test if a file is ignored by these rules

 @param {String} filePath
 @return {Boolean}
 */
Ignore.prototype.isFileIgnored = function (filename) {
    const ignore = this.getIgnore();
    return ignore.filter([filename]).length == 0;
};

/**
 Add rules

 @param {String}
 @return {Ignore}
 */
Ignore.prototype.add = function (rule) {
    const ignore = this.getIgnore();
    const newIgnore = createIgnore();

    newIgnore.add(ignore);
    newIgnore.add(rule);

    return this.set("ignore", newIgnore);
};

export default Ignore;
