// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'is'.
const is = require("is");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'semver'.
const semver = require("semver");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PREFIX'.
const PREFIX = require("../constants/pluginPrefix");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DEFAULT_VE... Remove this comment to see the full error message
const DEFAULT_VERSION = "*";

/*
 * PluginDependency represents the informations about a plugin
 * stored in config.plugins
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PluginDepe... Remove this comment to see the full error message
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
 * @param  {Boolean}
 * @return {PluginDependency}
 */
PluginDependency.prototype.toggle = function (state) {
    if (is.undef(state)) {
        state = !this.isEnabled();
    }

    return this.set("enabled", state);
};

/**
 * Return NPM ID for the dependency
 * @return {String}
 */
PluginDependency.prototype.getNpmID = function () {
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
PluginDependency.listFromString = function (s) {
    const parts = s.split(",");
    return PluginDependency.listFromArray(parts);
};

/**
 * Create a PluginDependency from an array
 * @param {Array}
 * @return {List<PluginDependency>}
 */
PluginDependency.listFromArray = function (arr) {
    return Immutable.List(arr)
        .map((entry) => {
            if (is.string(entry)) {
                return PluginDependency.createFromString(entry);
            } else {
                return PluginDependency({
                    name: entry.get("name"),
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
PluginDependency.nameToNpmID = function (s) {
    return PREFIX + s;
};

module.exports = PluginDependency;
