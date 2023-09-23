import Immutable from "immutable";
import TemplateBlock from "./templateBlock";
import PluginDependency from "./pluginDependency";
import THEME_PREFIX from "../constants/themePrefix";

const DEFAULT_VERSION = "*";

type Content = Immutable.Map<any, any>;
type Package = Immutable.Map<any, any>;

class Plugin extends Immutable.Record(
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
        content: Immutable.Map()
    },
    "Plugin"
) {
    getName(): string {
        return this.get("name");
    }

    getPath(): string {
        return this.get("path");
    }

    getVersion(): string {
        return this.get("version");
    }

    getPackage(): Package {
        return this.get("package");
    }

    getContent(): Content {
        return this.get("content");
    }

    getDepth(): number {
        return this.get("depth");
    }

    getParent(): string {
        return this.get("parent");
    }

    /**
     * Return the ID on NPM for this plugin
     * return package.json's name
     * @return {string}
     */

    getNpmID(): string {
        const pkg = this.getPackage().toJS();
        if ("name" in pkg) {
            return pkg["name"];
        }
        throw new Error(`${this.getName()} plugin's package.json does not have "name" fields.`);
    }

    /**
     * Check if a plugin is loaded
     * @return {boolean}
     */

    isLoaded(): boolean {
        return Boolean(this.getPackage().size > 0);
    }

    /**
     * Check if a plugin is a theme given its name
     * @return {boolean}
     */

    isTheme(): boolean {
        const name = this.getName();
        return name && name.indexOf(THEME_PREFIX) === 0;
    }

    /**
     * Return map of hooks
     */
    getHooks(): Immutable.Map<string, Function> {
        return this.getContent().get("hooks") || Immutable.Map();
    }

    /**
     * Return infos about resources for a specific type
     * @param {string} type
     * @return {Map<String:Mixed>}
     */

    getResources(type: string) {
        if (type != "website" && type != "ebook") {
            throw new Error(`Invalid assets type ${type}`);
        }

        const content = this.getContent();
        return content.get(type) || (type == "website" ? content.get("book") : null) || Immutable.Map();
    }

    /**
     * Return map of filters
     * @return {Map<String:Function>}
     */

    getFilters() {
        return this.getContent().get("filters");
    }

    /**
     * Return map of blocks
     * @return {Map<String:TemplateBlock>}
     */

    getBlocks() {
        let blocks = this.getContent().get("blocks");
        blocks = blocks || Immutable.Map();

        return blocks.map((block, blockName) => {
            return TemplateBlock.create(blockName, block);
        });
    }

    /**
     * Return a specific hook
     * @param {string} name
     * @return {Function|undefined}
     */

    getHook(name: string) {
        return this.getHooks().get(name);
    }

    /**
     * Create a plugin from a string
     * @return {Plugin}
     * @param s
     */

    static createFromString(s: string) {
        const parts = s.split("@");
        const name = parts[0];
        const version = parts.slice(1).join("@");

        return new Plugin({
            name: name,
            version: version || DEFAULT_VERSION
        });
    }

    /**
     * Create a plugin from a dependency
     * @return {Plugin}
     */

    static createFromDep(dep: PluginDependency) {
        return new Plugin({
            name: dep.getName(),
            version: dep.getVersion()
        });
    }
}

export default Plugin;
