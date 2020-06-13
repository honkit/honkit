const path = require("path");

const Book = require("../../models/book");
const NodeFS = require("../../fs/node");
const installPlugins = require("../installPlugins");

const Parse = require("../../parse");

describe.skip("installPlugins", () => {
    let book;

    jest.setTimeout(30000);

    beforeAll(() => {
        const fs = NodeFS(path.resolve(__dirname, "../../../../../"));
        const baseBook = Book.createForFS(fs);

        return Parse.parseConfig(baseBook).then((_book) => {
            book = _book;
        });
    });

    test("must install all plugins from NPM", () => {
        return installPlugins(book, { "dry-run": true, audit: false, "prefer-offline": true }).then((n) => {
            expect(n).toBe(2);
        });
    });
});
