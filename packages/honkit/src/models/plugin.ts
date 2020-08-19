// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TemplateBl... Remove this comment to see the full error message
const TemplateBlock = require("./templateBlock");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PluginDepe... Remove this comment to see the full error message
const PluginDependency = require("./pluginDependency");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'THEME_PREF... Remove this comment to see the full error message
const THEME_PREFIX = require("../constants/themePrefix");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DEFAULT_VE... Remove this comment to see the full error message
const DEFAULT_VERSION = "*";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Plugin'.
const Plugin = Immutable.Record(
    {
        name: String(),

        // Requirement version (ex: ">1.0.0")
        version: String(DEFAULT_VERSION),

        // Path to load this plugin
        path: String(),

        // Depth of this plugin in the dependency tree
        depth: Number(0),

        // Parent depending on this plugin
        parent: String(),

        // Content of the "package.json"
        package: Immutable.Map(),

        // Content of the package itself
        content: Immutable.Map(),
    },
    "Plugin"
);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'getName' does not exist on type 'Plugin'... Remove this comment to see the full error message
Plugin.prototype.getName = function () {
    return this.get("name");
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'getPath' does not exist on type 'Plugin'... Remove this comment to see the full error message
Plugin.prototype.getPath = function () {
    return this.get("path");
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'getVersion' does not exist on type 'Plug... Remove this comment to see the full error message
Plugin.prototype.getVersion = function () {
    return this.get("version");
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'getPackage' does not exist on type 'Plug... Remove this comment to see the full error message
Plugin.prototype.getPackage = function () {
    return this.get("package");
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'getContent' does not exist on type 'Plug... Remove this comment to see the full error message
Plugin.prototype.getContent = function () {
    return this.get("content");
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'getDepth' does not exist on type 'Plugin... Remove this comment to see the full error message
Plugin.prototype.getDepth = function () {
    return this.get("depth");
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'getParent' does not exist on type 'Plugi... Remove this comment to see the full error message
Plugin.prototype.getParent = function () {
    return this.get("parent");
};

/**
 * Return the ID on NPM for this plugin
 * @return {String}
 */
// @ts-expect-error ts-migrate(2339) FIXME: Property 'getNpmID' does not exist on type 'Plugin... Remove this comment to see the full error message
Plugin.prototype.getNpmID = function () {
    return PluginDependency.nameToNpmID(this.getName());
};

/**
 * Check if a plugin is loaded
 * @return {Boolean}
 */
// @ts-expect-error ts-migrate(2339) FIXME: Property 'isLoaded' does not exist on type 'Plugin... Remove this comment to see the full error message
Plugin.prototype.isLoaded = function () {
    return Boolean(this.getPackage().size > 0);
};

/**
 * Check if a plugin is a theme given its name
 * @return {Boolean}
 */
// @ts-expect-error ts-migrate(2339) FIXME: Property 'isTheme' does not exist on type 'Plugin'... Remove this comment to see the full error message
Plugin.prototype.isTheme = function () {
    const name = this.getName();
    return name && name.indexOf(THEME_PREFIX) === 0;
};

/**
 * Return map of hooks
 * @return {Map<String:Function>}
 */
// @ts-expect-error ts-migrate(2339) FIXME: Property 'getHooks' does not exist on type 'Plugin... Remove this comment to see the full error message
Plugin.prototype.getHooks = function () {
    return this.getContent().get("hooks") || Immutable.Map();
};

/**
 * Return infos about resources for a specific type
 * @param {String} type
 * @return {Map<String:Mixed>}
 */
// @ts-expect-error ts-migrate(2339) FIXME: Property 'getResources' does not exist on type 'Pl... Remove this comment to see the full error message
Plugin.prototype.getResources = function (type) {
    if (type != "website" && type != "ebook") {
        throw new Error(`Invalid assets type ${type}`);
    }

    const content = this.getContent();
    return content.get(type) || (type == "website" ? content.get("book") : null) || Immutable.Map();
};

/**
 * Return map of filters
 * @return {Map<String:Function>}
 */
// @ts-expect-error ts-migrate(2339) FIXME: Property 'getFilters' does not exist on type 'Plug... Remove this comment to see the full error message
Plugin.prototype.getFilters = function () {
    return this.getContent().get("filters");
};

/**
 * Return map of blocks
 * @return {Map<String:TemplateBlock>}
 */
// @ts-expect-error ts-migrate(2339) FIXME: Property 'getBlocks' does not exist on type 'Plugi... Remove this comment to see the full error message
Plugin.prototype.getBlocks = function () {
    let blocks = this.getContent().get("blocks");
    blocks = blocks || Immutable.Map();

    return blocks.map((block, blockName) => {
        return TemplateBlock.create(blockName, block);
    });
};

/**
 * Return a specific hook
 * @param {String} name
 * @return {Function|undefined}
 */
// @ts-expect-error ts-migrate(2339) FIXME: Property 'getHook' does not exist on type 'Plugin'... Remove this comment to see the full error message
Plugin.prototype.getHook = function (name) {
    return this.getHooks().get(name);
};

/**
 * Create a plugin from a string
 * @param {String}
 * @return {Plugin}
 */
// @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
Plugin.createFromString = function (s) {
    const parts = s.split("@");
    const name = parts[0];
    const version = parts.slice(1).join("@");

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    return new Plugin({
        name: name,
        version: version || DEFAULT_VERSION,
    });
};

/**
 * Create a plugin from a dependency
 * @param {PluginDependency}
 * @return {Plugin}
 */
// @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromDep' does not exist on type '{... Remove this comment to see the full error message
Plugin.createFromDep = function (dep) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    return new Plugin({
        name: dep.getName(),
        version: dep.getVersion(),
    });
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'nameToNpmID' does not exist on type '{ n... Remove this comment to see the full error message
Plugin.nameToNpmID = PluginDependency.nameToNpmID;

module.exports = Plugin;
