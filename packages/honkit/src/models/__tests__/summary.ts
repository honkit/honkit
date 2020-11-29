import Summary from "../summary";
import File from "../file";
describe("Summary", () => {
    const summary = Summary.createFromParts(new File(), [
        {
            articles: [
                // 1.1
                {
                    title: "My First Article",
                    ref: "README.md",
                },
                // 1.2
                {
                    title: "My Second Article",
                    ref: "article.md",
                },
                // 1.3
                {
                    title: "My Third Article with anchor",
                    ref: "article-anchor.md",
                    articles: [
                        {
                            title: "Article with anchor",
                            ref: "article-anchor.md#anchor",
                        },
                    ],
                },
                // 1.4
                {
                    title: "Article without ref",
                },
                // 1.5
                {
                    title: "Article with absolute ref",
                    ref: "https://google.fr",
                },
            ],
        },
        {
            title: "Test",
        },
    ]);

    describe("createFromEntries", () => {
        test("must add all parts", () => {
            const parts = summary.getParts();
            expect(parts.size).toBe(2);
        });
    });

    describe("getNextArticle", () => {
        it("return next article", () => {
            const nextArticle = summary.getNextArticle("1.1");
            expect(nextArticle.getLevel()).toBe("1.2");
        });

        it("ignore anchor article", () => {
            const nextArticle = summary.getNextArticle("1.3"); // next is anchor
            expect(nextArticle.getLevel()).toBe("1.4");
        });
    });

    describe("getPrevArticle", () => {
        it("return prev article", () => {
            const prevArticle = summary.getPrevArticle("1.2");
            expect(prevArticle.getLevel()).toBe("1.1");
        });

        it("ignore anchor article", () => {
            const prevArticle = summary.getPrevArticle("1.4");
            expect(prevArticle.getLevel()).toBe("1.3");
        });
    });
    describe("getByLevel", () => {
        test("can return a Part", () => {
            const part = summary.getByLevel("1");

            expect(part).toBeDefined();
            expect(part.getArticles().size).toBe(5);
        });

        test("can return a Part (2)", () => {
            const part = summary.getByLevel("2");

            expect(part).toBeDefined();
            expect(part.getTitle()).toBe("Test");
            expect(part.getArticles().size).toBe(0);
        });

        test("can return an Article", () => {
            const article = summary.getByLevel("1.1");

            expect(article).toBeDefined();
            expect(article.getTitle()).toBe("My First Article");
        });
    });

    describe("getByPath", () => {
        test("return correct article", () => {
            const article = summary.getByPath("README.md");

            expect(article).toBeDefined();
            expect(article.getTitle()).toBe("My First Article");
        });

        test("return correct article", () => {
            const article = summary.getByPath("article.md");

            expect(article).toBeDefined();
            expect(article.getTitle()).toBe("My Second Article");
        });

        test("return undefined if not found", () => {
            const article = summary.getByPath("NOT_EXISTING.md");

            expect(article).toBeFalsy();
        });
    });

    describe("toText", () => {
        test("return as markdown", () => {
            return summary.toText(".md").then((text) => {
                expect(text).toContain("# Summary");
            });
        });
    });
});
