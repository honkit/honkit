import SummaryPart from "../summaryPart";

describe("SummaryPart", () => {
    describe("createChildLevel", () => {
        test("must create the right level", () => {
            const article = SummaryPart.create({}, "1");
            expect(article.createChildLevel()).toBe("1.1");
        });

        test("must create the right level when has articles", () => {
            const article = SummaryPart.create(
                {
                    articles: [
                        {
                            title: "Test",
                        },
                    ],
                },
                "1"
            );
            expect(article.createChildLevel()).toBe("1.2");
        });
    });
});
