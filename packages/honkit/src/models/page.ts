// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
const yaml = require("js-yaml");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'File'.
const File = require("./file");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hashString... Remove this comment to see the full error message
const { hashString } = require("./hash.js");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Page'.
const Page = Immutable.Record({
    // @ts-expect-error ts-migrate(2348) FIXME: Value of type '{ new (fileBits: BlobPart[], fileNa... Remove this comment to see the full error message
    file: File(),

    // Attributes extracted from the YAML header
    attributes: Immutable.Map(),

    // Content of the page
    content: String(),

    // Direction of the text
    dir: String("ltr"),
});

Page.prototype.getFile = function () {
    return this.get("file");
};

Page.prototype.getAttributes = function () {
    return this.get("attributes");
};

Page.prototype.getContent = function () {
    return this.get("content");
};

Page.prototype.getDir = function () {
    return this.get("dir");
};

/**
 * Return page as text
 * @return {String}
 */
Page.prototype.toText = function () {
    const attrs = this.getAttributes();
    const content = this.getContent();

    if (attrs.size === 0) {
        return content;
    }

    const frontMatter = `---\n${yaml.safeDump(attrs.toJS(), { skipInvalid: true })}---\n\n`;
    return frontMatter + (content || "");
};

/**
 * Return path of the page
 * @return {String}
 */
Page.prototype.getPath = function () {
    return this.getFile().getPath();
};

/**
 * Create a page for a file
 * @param {File} file
 * @return {Page}
 */
Page.createForFile = function (file) {
    return new Page({
        file: file,
    });
};

/**
 * Load a page for a file
 * @param {File} file
 * @param {string} content
 * @return {Page}
 */
Page.loadFile = function (file, content) {
    return new Page({
        file: file,
        content: content,
    });
};

Page.fromJSON = function (json) {
    return new Page({
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2-3 arguments, but got 1.
        file: new File(json.file),
        // Attributes extracted from the YAML header
        attributes: Immutable.Map(json.atributes),
        // Content of the page
        content: json.content,
        // Direction of the text
        dir: json.dir,
    });
};
Page.toJSON = function (page) {
    return page.toJS();
};
Page.prototype.hash = function () {
    return hashString(JSON.stringify(this.toJS()));
};

module.exports = Page;
