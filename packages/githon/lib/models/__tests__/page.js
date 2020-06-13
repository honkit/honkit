const Immutable = require("immutable");
const Page = require("../page");

describe("Page", () => {
    describe("toText", () => {
        test("must not prepend frontmatter if no attributes", () => {
            const page = Page().merge({
                content: "Hello World",
            });

            expect(page.toText()).toBe("Hello World");
        });

        test("must prepend frontmatter if attributes", () => {
            const page = Page().merge({
                content: "Hello World",
                attributes: Immutable.fromJS({
                    hello: "world",
                }),
            });

            expect(page.toText()).toBe("---\nhello: world\n---\n\nHello World");
        });
    });
});
