var tmp = require("tmp");
var initBook = require("../init");

describe("initBook", () => {
    var dir;

    beforeEach(() => {
        dir = tmp.dirSync();
    });

    test("should create a README and SUMMARY for empty book", () => {
        return initBook(dir.name).then(function () {
            expect(dir.name).toHaveFile("README.md");
            expect(dir.name).toHaveFile("SUMMARY.md");
        });
    });
});
