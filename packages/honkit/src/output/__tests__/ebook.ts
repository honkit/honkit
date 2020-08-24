import generateMock from "../testing/generateMock";
import EbookGenerator from "../ebook";

describe("EbookGenerator", () => {
    test("should generate a SUMMARY.html", () => {
        return generateMock(EbookGenerator, {
            "README.md": "Hello World"
        }).then((folder) => {
            expect(folder).toHaveFile("SUMMARY.html");
            expect(folder).toHaveFile("index.html");
        });
    });
});
