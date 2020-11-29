import is from "is";
import semver from "semver";
import Immutable from "immutable";
import PREFIX from "../constants/pluginPrefix";

const DEFAULT_VERSION = "*";

/*
 * PluginDependency represents the informations about a plugin
 * stored in config.plugins
 */
const PluginDependency = Immutable.Record(
    {
        name: String(),

        // Requirement version (ex: ">1.0.0")
        version: String(DEFAULT_VERSION),

        // path to package
        path: String(),

        // Is this plugin enabled or disabled?
        enabled: Boolean(true),
    },
    "PluginDependency"
);

PluginDependency.prototype.getName = function () {
    return this.get("name");
};

PluginDependency.prototype.getVersion = function () {
    return this.get("version");
};

PluginDependency.prototype.getPath = function () {
    return this.get("path");
};

PluginDependency.prototype.isEnabled = function () {
    return this.get("enabled");
};

/**
 * Toggle this plugin state
 * @return {PluginDependency}
 */
PluginDependency.prototype.toggle = function (state?: boolean) {
    if (state === undefined) {
        state = !this.isEnabled();
    }

    return this.set("enabled", state);
};

/**
 * Return NPM ID for the dependency
 * @return {String}
 */
PluginDependency.prototype.getNpmID = function () {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nameToNpmID' does not exist on type 'Cla... Remove this comment to see the full error message
    return PluginDependency.nameToNpmID(this.getName());
};

/**
 * Is the plugin using a git dependency
 * @return {Boolean}
 */
PluginDependency.prototype.isGitDependency = function () {
    return !semver.validRange(this.getVersion());
};

/**
 * Create a plugin with a name and a plugin
 * @param {String}
 * @return {Plugin|undefined}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
PluginDependency.create = function (name, version, enabled) {
    if (is.undefined(enabled)) {
        enabled = true;
    }

    return new PluginDependency({
        name: name,
        version: version || DEFAULT_VERSION,
        enabled: Boolean(enabled),
    });
};

/**
 * Create a plugin from a string
 * @param {string} s
 * @return {Plugin|undefined}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
PluginDependency.createFromString = function (s) {
    /*
    HonKit will support following format
     pkg
     @scope/pkg
     -pkg               - Disable package
     -@scope/pkg        - Disable package
    */
    const packagePattern = /^(?<disabled>-)?(?<name>.+)$/;
    const scopedPackagePattern = /^(?<disabled>-)?(?<name>@[^/]+\/.+)$/;
    if (packagePattern.test(s) && !s.includes("@")) {
        const match = s.match(packagePattern);
        const enabled = !match.groups.disabled;
        return new PluginDependency({
            name: match.groups.name,
            version: DEFAULT_VERSION,
            enabled: enabled,
        });
    } else if (scopedPackagePattern.test(s)) {
        const match = s.match(scopedPackagePattern);
        const enabled = !match.groups.disabled;
        return new PluginDependency({
            name: match.groups.name,
            version: DEFAULT_VERSION,
            enabled: enabled,
        });
    } else {
        /*
         Deprecated It is only for backward compatible
         This is original GitBook logic supports

         pkg@version          - backward compatible with GitBook
         pkg@>=version        - backward compatible with GitBook
         hello@git+ssh://samy@github.com/GitbookIO/plugin-ga.git

         Note: This logic does not support scoped module
         */
        const parts = s.split("@");
        let name = parts[0];
        const version = parts.slice(1).join("@");
        let enabled = true;
        if (name[0] === "-") {
            enabled = false;
            name = name.slice(1);
        }
        return new PluginDependency({
            name: name,
            version: version || DEFAULT_VERSION,
            enabled: enabled,
        });
    }
};

/**
 * Create a PluginDependency from a string
 * @param {String}
 * @return {List<PluginDependency>}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'listFromString' does not exist on type '... Remove this comment to see the full error message
PluginDependency.listFromString = function (s) {
    const parts = s.split(",");

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'listFromArray' does not exist on type 'C... Remove this comment to see the full error message
    return PluginDependency.listFromArray(parts);
};

/**
 * Create a PluginDependency from an array
 * @param {Array}
 * @return {List<PluginDependency>}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'listFromArray' does not exist on type 'C... Remove this comment to see the full error message
PluginDependency.listFromArray = function (arr) {
    return Immutable.List(arr)
        .map((entry) => {
            if (is.string(entry)) {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
                return PluginDependency.createFromString(entry);
            } else {
                return PluginDependency({
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'get' does not exist on type 'unknown'.
                    name: entry.get("name"),

                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'get' does not exist on type 'unknown'.
                    version: entry.get("version"),
                });
            }
        })
        .filter((dep) => {
            return Boolean(dep.getName());
        });
};

/**
 * Export plugin dependencies as an array
 * @param {List<PluginDependency>} list
 * @return {Array<String>}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'listToArray' does not exist on type 'Cla... Remove this comment to see the full error message
PluginDependency.listToArray = function (list) {
    return list
        .map((dep) => {
            let result = "";

            if (!dep.isEnabled()) {
                result += "-";
            }

            result += dep.getName();
            if (dep.getVersion() !== DEFAULT_VERSION) {
                result += `@${dep.getVersion()}`;
            }

            return result;
        })
        .toJS();
};

/**
 * Return NPM id for a plugin name
 * @param {String}
 * @return {String}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'nameToNpmID' does not exist on type 'Cla... Remove this comment to see the full error message
PluginDependency.nameToNpmID = function (s) {
    return PREFIX + s;
};

export default PluginDependency;
