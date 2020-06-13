const path = require("path");

const PluginDependency = require("../../models/pluginDependency");
const Book = require("../../models/book");
const NodeFS = require("../../fs/node");
const installPlugin = require("../installPlugin");

const Parse = require("../../parse");

describe.skip("installPlugin", () => {
    let book;

    jest.setTimeout(30000);

    beforeAll(() => {
        const fs = NodeFS(path.resolve(__dirname, "../../../../.."));
        const baseBook = Book.createForFS(fs);

        return Parse.parseConfig(baseBook).then((_book) => {
            book = _book;
        });
    });

    test("must install a plugin from NPM", () => {
        const dep = PluginDependency.createFromString("ga");
        return installPlugin(book, dep, { "dry-run": true, audit: false, "prefer-offline": true });
    });
});
