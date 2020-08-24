import SummaryArticle from "../summaryArticle";
import File from "../file";

describe("SummaryArticle", () => {
    describe("createChildLevel", () => {
        test("must create the right level", () => {

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
            const article = SummaryArticle.create({}, "1.1");
            expect(article.createChildLevel()).toBe("1.1.1");
        });

        test("must create the right level when has articles", () => {

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
            const article = SummaryArticle.create(
                {
                    articles: [
                        {
                            title: "Test"
                        }
                    ]
                },
                "1.1"
            );
            expect(article.createChildLevel()).toBe("1.1.2");
        });
    });

    describe("isFile", () => {
        test("must return true when exactly the file", () => {

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
            const article = SummaryArticle.create(
                {
                    ref: "hello.md"
                },
                "1.1"
            );
            // @ts-expect-error
            const file = File.createWithFilepath("hello.md");

            expect(article.isFile(file)).toBe(true);
        });

        test("must return true when path is not normalized", () => {

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
            const article = SummaryArticle.create(
                {
                    ref: "/hello.md"
                },
                "1.1"
            );
            // @ts-expect-error
            const file = File.createWithFilepath("hello.md");

            expect(article.isFile(file)).toBe(true);
        });

        test("must return false when has anchor", () => {

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
            const article = SummaryArticle.create(
                {
                    ref: "hello.md#world"
                },
                "1.1"
            );
            // @ts-expect-error
            const file = File.createWithFilepath("hello.md");

            expect(article.isFile(file)).toBe(false);
        });
    });

    describe("hasAnchor", function() {
        it("must return false when ref does not have anchor", function() {

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
            var article = SummaryArticle.create({
                ref: "hello.md"
            }, "1.1");

            expect(article.hasAnchor()).toBe(false);
        });

        it("must return true when has anchor", function() {

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
            var article = SummaryArticle.create({
                ref: "hello.md#world"
            }, "1.1");

            expect(article.hasAnchor()).toBe(true);
        });
    });
});
