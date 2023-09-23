import nunjucks from "nunjucks";
import Immutable from "immutable";
import TemplateBlock from "./templateBlock";
import TemplateOutput from "./templateOutput";

type Extensions = Immutable.Map<any, any>;

class TemplateEngine extends Immutable.Record(
    {
        // Map of {TemplateBlock}
        blocks: Immutable.Map(),

        // Map of Extension
        extensions: Immutable.Map(),

        // Map of filters: {string} name -> {Function} fn
        filters: Immutable.Map(),

        // Map of globals: {string} name -> {Mixed}
        globals: Immutable.Map(),

        // Context for filters / blocks
        context: Object(),

        // Nunjucks loader
        loader: new nunjucks.FileSystemLoader("views")
    },
    "TemplateEngine"
) {
    getBlocks(): TemplateBlock {
        return this.get("blocks");
    }

    getGlobals(): Immutable.Map<string, any> {
        return this.get("globals");
    }

    getFilters() {
        return this.get("filters");
    }

    getShortcuts() {
        return this.get("shortcuts");
    }

    getLoader(): nunjucks.FileSystemLoader {
        return this.get("loader");
    }

    getContext(): object {
        return this.get("context");
    }

    getExtensions(): Extensions {
        return this.get("extensions");
    }

    /**
     Return a block by its name (or undefined)

     @param {string} name
     @return {TemplateBlock}
     */
    getBlock(name: string): TemplateBlock {
        const blocks = this.getBlocks();
        return blocks.find((block) => {
            return block.getName() === name;
        });
    }

    /**
     Return a nunjucks environment from this configuration
     */
    toNunjucks(blocksOutput?: TemplateOutput): nunjucks.Environment {
        const loader = this.getLoader();
        const blocks = this.getBlocks();
        const filters = this.getFilters();
        const globals = this.getGlobals();
        const extensions = this.getExtensions();
        const context = this.getContext();

        const env = new nunjucks.Environment(loader, {
            // Escaping is done after by the asciidoc/markdown parser
            autoescape: false,

            // Syntax
            tags: {
                blockStart: "{%",
                blockEnd: "%}",
                variableStart: "{{",
                variableEnd: "}}",
                commentStart: "{###",
                commentEnd: "###}"
            }
        });

        // Add filters
        filters.forEach((filterFn, filterName) => {
            env.addFilter(filterName, filterFn.bind(context));
        });

        // Add blocks
        blocks.forEach((block) => {
            const extName = block.getExtensionName();
            const Ext = block.toNunjucksExt(context, blocksOutput);

            env.addExtension(extName, new Ext());
        });

        // Add globals
        globals.forEach((globalValue, globalName) => {
            env.addGlobal(globalName, globalValue);
        });

        // Add other extensions
        extensions.forEach((ext, extName) => {
            env.addExtension(extName, ext);
        });

        return env;
    }

    /**
     Create a template engine

     @param {Object} def
     @return {TemplateEngine}
     */
    static create(def: any): TemplateEngine {
        return new TemplateEngine({
            blocks: Immutable.List(def.blocks || []),
            extensions: Immutable.Map(def.extensions || {}),
            filters: Immutable.Map(def.filters || {}),
            globals: Immutable.Map(def.globals || {}),
            context: def.context,
            loader: def.loader
        });
    }
}

export default TemplateEngine;
