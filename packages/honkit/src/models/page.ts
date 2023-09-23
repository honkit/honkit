import Immutable from "immutable";
import yaml from "js-yaml";
import File from "./file";
import { hashString } from "./hash";

class Page extends Immutable.Record({
    file: new File(),

    // Attributes extracted from the YAML header
    attributes: Immutable.Map(),

    // Content of the page
    content: String(),

    // Direction of the text
    dir: String("ltr")
}) {
    getFile(): File {
        return this.get("file");
    }

    getAttributes() {
        return this.get("attributes");
    }

    getContent(): string {
        return this.get("content");
    }

    getDir(): string {
        return this.get("dir");
    }

    /**
     * Return page as text
     * @return {string}
     */
    toText(): string {
        const attrs = this.getAttributes();
        const content = this.getContent();

        if (attrs.size === 0) {
            return content;
        }

        const frontMatter = `---\n${yaml.safeDump(attrs.toJS(), { skipInvalid: true })}---\n\n`;
        return frontMatter + (content || "");
    }

    /**
     * Return path of the page
     * @return {string}
     */
    getPath(): string {
        return this.getFile().getPath();
    }

    /**
     * Create a page for a file
     * @param {File} file
     * @return {Page}
     */
    static createForFile(file: File): Page {
        return new Page({
            file: file
        });
    }

    /**
     * Load a page for a file
     * @param {File} file
     * @param {string} content
     * @return {Page}
     */
    static loadFile(file: File, content: string): Page {
        return new Page({
            file: file,
            content: content
        });
    }

    static fromJSON(json: {
        file: { [key: string]: any };
        atributes: Immutable.Iterable.Keyed<unknown, unknown>;
        content: any;
        dir: any;
    }) {
        return new Page({
            file: new File(json.file),
            // Attributes extracted from the YAML header
            attributes: Immutable.Map(json.atributes),
            // Content of the page
            content: json.content,
            // Direction of the text
            dir: json.dir
        });
    }

    static toJSON(page: Page) {
        return page.toJS();
    }

    hash() {
        return hashString(JSON.stringify(this.toJS()));
    }
}

export default Page;
