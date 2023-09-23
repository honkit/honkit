import is from "is";
import semver from "semver";
import Immutable from "immutable";
import PREFIX from "../constants/pluginPrefix";

const DEFAULT_VERSION = "*";

/*
 * PluginDependency represents the information about a plugin
 * stored in config.plugins
 */
class PluginDependency extends Immutable.Record(
    {
        name: String(),

        // Requirement version (ex: ">1.0.0")
        version: String(DEFAULT_VERSION),

        // path to package
        path: String(),

        // Is this plugin enabled or disabled?
        enabled: Boolean(true)
    },
    "PluginDependency"
) {
    getName() {
        return this.get("name");
    }

    getVersion() {
        return this.get("version");
    }

    getPath() {
        return this.get("path");
    }

    isEnabled() {
        return this.get("enabled");
    }

    /**
     * Toggle this plugin state
     * @return {PluginDependency}
     */
    toggle(state?: boolean) {
        if (state === undefined) {
            state = !this.isEnabled();
        }

        return this.set("enabled", state);
    }

    /**
     * Is the plugin using a git dependency
     * @return {boolean}
     */
    isGitDependency() {
        return !semver.validRange(this.getVersion());
    }

    /**
     * Create a plugin with a name and a plugin
     * @return {Plugin|undefined}
     */
    static create(name: string, version: string, enabled?: boolean) {
        if (is.undefined(enabled)) {
            enabled = true;
        }

        return new PluginDependency({
            name: name,
            version: version || DEFAULT_VERSION,
            enabled: Boolean(enabled)
        });
    }

    /**
     * Create a plugin from a string
     * @param {string} s
     * @return {Plugin|undefined}
     */
    static createFromString(s) {
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
                enabled: enabled
            });
        } else if (scopedPackagePattern.test(s)) {
            const match = s.match(scopedPackagePattern);
            const enabled = !match.groups.disabled;
            return new PluginDependency({
                name: match.groups.name,
                version: DEFAULT_VERSION,
                enabled: enabled
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
                enabled: enabled
            });
        }
    }

    /**
     * Create a PluginDependency from a string
     * @param {string}
     * @return {List<PluginDependency>}
     */
    static listFromString(s) {
        const parts = s.split(",");
        return PluginDependency.listFromArray(parts);
    }

    /**
     * Create a PluginDependency from an array
     */
    static listFromArray(arr: (PluginDependency | string)[]) {
        return Immutable.List(arr)
            .map((entry) => {
                if (typeof entry === "string") {
                    return PluginDependency.createFromString(entry);
                } else {
                    return new PluginDependency({
                        name: entry.get("name"),
                        version: entry.get("version")
                    });
                }
            })
            .filter((dep) => {
                return Boolean(dep.getName());
            });
    }

    /**
     * Export plugin dependencies as an array
     * @param {List<PluginDependency>} list
     * @return {Array<String>}
     */
    static listToArray(list) {
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
    }
}

export default PluginDependency;
