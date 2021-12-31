import SummaryArticle from "../summaryArticle";
import File from "../file";
import encodeSummaryArticleWithCache from "../../json/encodeSummaryArticleWithCache";
import encodeSummaryArticle from "../../json/encodeSummaryArticle";

describe("SummaryArticle", () => {
    describe("createChildLevel", () => {
        test("must create the right level", () => {
            const article = SummaryArticle.create({}, "1.1");
            expect(article.createChildLevel()).toBe("1.1.1");
        });

        test("must create the right level when has articles", () => {
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

    describe("hasAnchor", function () {
        it("must return false when ref does not have anchor", function () {
            var article = SummaryArticle.create(
                {
                    ref: "hello.md",
                },
                "1.1"
            );

            expect(article.hasAnchor()).toBe(false);
        });

        it("must return true when has anchor", function () {
            var article = SummaryArticle.create(
                {
                    ref: "hello.md#world",
                },
                "1.1"
            );

            expect(article.hasAnchor()).toBe(true);
        });
    });

    describe("withCache", function () {
        it("encodeSummaryArticle (non cached) should return an object", function () {
            var article = SummaryArticle.create(
                {
                    ref: "1-1.md",
                },
                "1.1"
            );

            expect(encodeSummaryArticle(article)).toBeInstanceOf(Object)
        });
        
        it("encodeSummaryArticleWithCache (cached) should return an object", function () {
            var article = SummaryArticle.create(
                {
                    ref: "1-1.md",
                },
                "1.1"
            );

            expect(encodeSummaryArticleWithCache(article)).toBeInstanceOf(Object)
        });

        it("encodeSummaryArticle (non cached) should return different object when pass difference SummaryArticle", function () {
            var article_1 = SummaryArticle.create(
                {
                    ref: "1-1.md"
                },
                "1.1"
            );
            var article_2 = SummaryArticle.create(
                {
                    ref: "1-2.md"
                },
                "1.2"
            );

            expect(encodeSummaryArticle(article_1)).not.toStrictEqual(encodeSummaryArticle(article_2));
        });

        it("encodeSummaryArticle (non cached) should return same object when pass same SummaryArticle", function () {
            var article = SummaryArticle.create(
                {
                    ref: "1-1.md"
                },
                "1.1"
            );

            expect(encodeSummaryArticle(article)).toStrictEqual(encodeSummaryArticle(article));
        });

        it("encodeSummaryArticleWithCache (cached) should return different object when pass difference SummaryArticle", function () {
            var article_1 = SummaryArticle.create(
                {
                    ref: "1-1.md"
                },
                "1.1"
            );
            var article_2 = SummaryArticle.create(
                {
                    ref: "1-2.md"
                },
                "1.2"
            );

            expect(encodeSummaryArticle(article_1)).not.toStrictEqual(encodeSummaryArticleWithCache(article_2));
        });

        it("encodeSummaryArticleWithCache (cached) should return same object when pass same SummaryArticle", function () {
            var article = SummaryArticle.create(
                {
                    ref: "1-1.md"
                },
                "1.1"
            );

            expect(encodeSummaryArticle(article)).toStrictEqual(encodeSummaryArticle(article));
        });

        it("encodeSummaryArticle (non cached) and encodeSummaryArticleWithCache (cached) should return same object when pass same SummaryArticle", function () {
            var article = SummaryArticle.create(
                {
                    ref: "1-1.md",
                    articles: [SummaryArticle.create({
                        ref: "2-1.md",
                    },
                    "2.1")]
                },
                "1.1"
            );

            expect(encodeSummaryArticle(article)).toStrictEqual(encodeSummaryArticleWithCache(article));
        });
    });
});
