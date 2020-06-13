var path = require("path");

var Book = require("../../models/book");
var NodeFS = require("../../fs/node");
var installPlugins = require("../installPlugins");

var Parse = require("../../parse");

describe.skip("installPlugins", () => {
    var book;

    jest.setTimeout(30000);

    beforeAll(() => {
        var fs = NodeFS(path.resolve(__dirname, "../../../../../"));
        var baseBook = Book.createForFS(fs);

        return Parse.parseConfig(baseBook).then(function (_book) {
            book = _book;
        });
    });

    test("must install all plugins from NPM", () => {
        return installPlugins(book, { "dry-run": true, audit: false, "prefer-offline": true }).then(function (n) {
            expect(n).toBe(2);
        });
    });
});
