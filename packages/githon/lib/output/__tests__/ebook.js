var generateMock = require("../testing/generateMock");
var EbookGenerator = require("../ebook");

describe("EbookGenerator", () => {
    test("should generate a SUMMARY.html", () => {
        return generateMock(EbookGenerator, {
            "README.md": "Hello World",
        }).then(function (folder) {
            expect(folder).toHaveFile("SUMMARY.html");
            expect(folder).toHaveFile("index.html");
        });
    });
});
