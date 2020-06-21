import SummaryArticle from "../summaryArticle";
import File from "../file";

describe("SummaryArticle", () => {
    describe("createChildLevel", () => {
        test("must create the right level", () => {
            // @ts-ignore
            const article = SummaryArticle.create({}, "1.1");
            expect(article.createChildLevel()).toBe("1.1.1");
        });

        test("must create the right level when has articles", () => {
            // @ts-ignore
            const article = SummaryArticle.create(
                {
                    articles: [
                        {
                            title: "Test",
                        },
                    ],
                },
                "1.1"
            );
            expect(article.createChildLevel()).toBe("1.1.2");
        });
    });

    describe("isFile", () => {
        test("must return true when exactly the file", () => {
            // @ts-ignore
            const article = SummaryArticle.create(
                {
                    ref: "hello.md",
                },
                "1.1"
            );
            const file = File.createWithFilepath("hello.md");

            expect(article.isFile(file)).toBe(true);
        });

        test("must return true when path is not normalized", () => {
            // @ts-ignore
            const article = SummaryArticle.create(
                {
                    ref: "/hello.md",
                },
                "1.1"
            );
            const file = File.createWithFilepath("hello.md");

            expect(article.isFile(file)).toBe(true);
        });

        test("must return false when has anchor", () => {
            // @ts-ignore
            const article = SummaryArticle.create(
                {
                    ref: "hello.md#world",
                },
                "1.1"
            );
            const file = File.createWithFilepath("hello.md");

            expect(article.isFile(file)).toBe(false);
        });
    });
});
