var path = require("path");

var Book = require("../../models/book");
var createNodeFS = require("../../fs/node");
var findForBook = require("../findForBook");

describe("findForBook", () => {
    var fs = createNodeFS(path.resolve(__dirname, "../../.."));
    var book = Book.createForFS(fs);

    test("should list default plugins", () => {
        return findForBook(book).then(function (plugins) {
            expect(plugins.has("fontsettings")).toBeTruthy();
        });
    });
});
