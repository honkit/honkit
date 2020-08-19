// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require("fs");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require("path");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parsePageF... Remove this comment to see the full error message
const parsePageFromString = require("../parse/parsePageFromString");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Book'.
const Book = require("./book");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LocationUt... Remove this comment to see the full error message
const LocationUtils = require("../utils/location");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Output'.
const Output = Immutable.Record({
    book: Book(),

    // Name of the generator being used
    generator: String(),

    // Map of plugins to use (String -> Plugin)
    plugins: Immutable.OrderedMap(),

    // Map pages to generation (String -> Page)
    pages: Immutable.OrderedMap(),

    // List assets (String)
    assets: Immutable.List(),

    // Option for the generation
    options: Immutable.Map(),

    // Internal state for the generation
    state: Immutable.Map(),

    // incrementalChangeFileSet for incremental building
    // If it is empty, should build all
    incrementalChangeFileSet: Immutable.Set(),
});

Output.prototype.getBook = function () {
    return this.get("book");
};

Output.prototype.getGenerator = function () {
    return this.get("generator");
};

Output.prototype.getPlugins = function () {
    return this.get("plugins");
};

Output.prototype.getPages = function () {
    return this.get("pages");
};

Output.prototype.getOptions = function () {
    return this.get("options");
};

Output.prototype.getAssets = function () {
    return this.get("assets");
};

Output.prototype.getState = function () {
    return this.get("state");
};

/**
 Return a page byt its file path

 @param {String} filePath
 @return {Page|undefined}
 */
Output.prototype.getPage = function (filePath) {
    filePath = LocationUtils.normalize(filePath);

    const pages = this.getPages();
    return pages.get(filePath);
};

Output.prototype.reloadPage = function (contentRootDir, filePath) {
    const relativePath = LocationUtils.normalize(path.normalize(path.relative(contentRootDir, filePath)));
    const pages = this.getPages();
    const page = pages.get(relativePath);
    if (!page) {
        return this;
    }
    const newPage = parsePageFromString(page, fs.readFileSync(filePath, "utf-8"));
    return this.merge({
        pages: pages.set(relativePath, newPage),
    });
};

/**
 Get root folder for output

 @return {String}
 */
Output.prototype.getRoot = function () {
    return this.getOptions().get("root");
};

/**
 Update state of output

 @param {Map} newState
 @return {Output}
 */
Output.prototype.setState = function (newState) {
    return this.set("state", newState);
};

/**
 Update options

 @param {Map} newOptions
 @return {Output}
 */
Output.prototype.setOptions = function (newOptions) {
    return this.set("options", newOptions);
};

/**
 Return logegr for this output (same as book)

 @return {Logger}
 */
Output.prototype.getLogger = function () {
    return this.getBook().getLogger();
};

module.exports = Output;
