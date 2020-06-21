import Summary from "../../../models/summary";
import FileModel from "../../../models/file";

describe("editPartTitle", () => {
    const editPartTitle = require("../editPartTitle");
    // @ts-expect-error
    const summary = Summary.createFromParts(FileModel(), [
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
        const newSummary = editPartTitle(summary, 0, "Hello World");
        const part = newSummary.getPart(0);

        expect(part.getTitle()).toBe("Hello World");
    });

    test("should correctly set title of second part", () => {
        const newSummary = editPartTitle(summary, 1, "Hello");
        const part = newSummary.getPart(1);

        expect(part.getTitle()).toBe("Hello");
    });

    test("should not fail if part doesn't exist", () => {
        const newSummary = editPartTitle(summary, 3, "Hello");
        expect(newSummary.getParts().size).toBe(2);
    });
});
