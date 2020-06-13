var Summary = require("../../../models/summary");
var File = require("../../../models/file");

describe("editPartTitle", () => {
    var editPartTitle = require("../editPartTitle");
    var summary = Summary.createFromParts(File(), [
        {
            articles: [
                {
                    title: "My First Article",
                    path: "README.md",
                },
                {
                    title: "My Second Article",
                    path: "article.md",
                },
            ],
        },
        {
            title: "Test",
        },
    ]);

    test("should correctly set title of first part", () => {
        var newSummary = editPartTitle(summary, 0, "Hello World");
        var part = newSummary.getPart(0);

        expect(part.getTitle()).toBe("Hello World");
    });

    test("should correctly set title of second part", () => {
        var newSummary = editPartTitle(summary, 1, "Hello");
        var part = newSummary.getPart(1);

        expect(part.getTitle()).toBe("Hello");
    });

    test("should not fail if part doesn't exist", () => {
        var newSummary = editPartTitle(summary, 3, "Hello");
        expect(newSummary.getParts().size).toBe(2);
    });
});
