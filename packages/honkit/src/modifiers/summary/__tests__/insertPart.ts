import Summary from "../../../models/summary";
import SummaryPart from "../../../models/summaryPart";
import FileModel from "../../../models/file";
import insertPart from "../insertPart";
describe("insertPart", () => {
    const summary = Summary.createFromParts(new FileModel(), [
        {
            articles: [
                {
                    title: "1.1",
                    path: "1.1",
                },
            ],
        },
        {
            title: "Part I",
            articles: [
                {
                    title: "2.1",
                    path: "2.1",
                    articles: [],
                },
                {
                    title: "2.2",
                    path: "2.2",
                },
            ],
        },
    ]);

    test("should insert an part at a given level", () => {
        const part = SummaryPart.create(
            {
                title: "Inserted",
            },
            "meaningless.level"
        );

        const newSummary = insertPart(summary, part, 1);

        const inserted = newSummary.getPart(1);
        expect(inserted.getTitle()).toBe("Inserted");
        expect(newSummary.getParts().count()).toBe(3);

        const otherArticle = newSummary.getByLevel("3.1");
        expect(otherArticle.getTitle()).toBe("2.1");
        expect(otherArticle.getLevel()).toBe("3.1");
    });

    test("should insert an part in last position", () => {
        const part = SummaryPart.create(
            {
                title: "Inserted",
            },
            "meaningless.level"
        );

        const newSummary = insertPart(summary, part, 2);

        const inserted = newSummary.getPart(2);
        expect(inserted.getTitle()).toBe("Inserted");
        expect(newSummary.getParts().count()).toBe(3);
    });
});
