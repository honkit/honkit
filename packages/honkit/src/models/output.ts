import fs from "fs";
import path from "path";
import Immutable from "immutable";
import parsePageFromString from "../parse/parsePageFromString";
import Book from "./book";
import LocationUtils from "../utils/location";
import Page from "./page";
import type GeneratorState from "../output/website/state";

type Assets = Immutable.List<string>;
type State = GeneratorState;
type Options = Immutable.Map<any, any>;
class Output extends Immutable.Record({
    book: new Book(),

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
    incrementalChangeFileSet: Immutable.Set()
}) {
    getBook(): Book {
        return this.get("book");
    }

    getGenerator(): string {
        return this.get("generator");
    }

    getPlugins(): Immutable.OrderedMap<string, Plugin> {
        return this.get("plugins");
    }

    getPages(): Immutable.OrderedMap<string, Page> {
        return this.get("pages");
    }

    getOptions(): Options {
        return this.get("options");
    }

    getAssets(): Assets {
        return this.get("assets");
    }

    getState(): State {
        return this.get("state");
    }

    /**
     Return a page byt its file path

     @param {string} filePath
     @return {Page|undefined}
     */
    getPage(filePath: string): Page | undefined {
        filePath = LocationUtils.normalize(filePath);

        const pages = this.getPages();
        return pages.get(filePath);
    }

    reloadPage(contentRootDir: string, filePath: string) {
        const relativePath = LocationUtils.normalize(path.normalize(path.relative(contentRootDir, filePath)));
        const pages = this.getPages();
        const page = pages.get(relativePath);
        if (!page) {
            return this;
        }
        const newPage = parsePageFromString(page, fs.readFileSync(filePath, "utf-8"));
        return this.merge({
            pages: pages.set(relativePath, newPage)
        });
    }

    /**
     Get root folder for output

     @return {string}
     */
    getRoot(): string {
        return this.getOptions().get("root");
    }

    /**
     Update state of output

     @param {Map} newState
     @return {Output}
     */
    setState(newState: State): Output {
        return this.set("state", newState) as Output;
    }

    /**
     Update options

     @param {Map} newOptions
     @return {Output}
     */
    setOptions(newOptions: Options): Output {
        return this.set("options", newOptions) as Output;
    }

    /**
     Return logegr for this output (same as book)

     @return {Logger}
     */
    getLogger() {
        return this.getBook().getLogger();
    }
}

export default Output;
