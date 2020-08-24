import SummaryPart from "../summaryPart";

describe("SummaryPart", () => {
    describe("createChildLevel", () => {
        test("must create the right level", () => {
            
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
            const article = SummaryPart.create({}, "1");
            expect(article.createChildLevel()).toBe("1.1");
        });

        test("must create the right level when has articles", () => {
            
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
            const article = SummaryPart.create(
                {
                    articles: [
                        {
                            title: "Test"
                        }
                    ]
                },
                "1"
            );
            expect(article.createChildLevel()).toBe("1.2");
        });
    });
});
