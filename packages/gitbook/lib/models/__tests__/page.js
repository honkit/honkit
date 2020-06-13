var Immutable = require("immutable");
var Page = require("../page");

describe("Page", () => {
    describe("toText", () => {
        test("must not prepend frontmatter if no attributes", () => {
            var page = Page().merge({
                content: "Hello World",
            });

            expect(page.toText()).toBe("Hello World");
        });

        test("must prepend frontmatter if attributes", () => {
            var page = Page().merge({
                content: "Hello World",
                attributes: Immutable.fromJS({
                    hello: "world",
                }),
            });

            expect(page.toText()).toBe("---\nhello: world\n---\n\nHello World");
        });
    });
});
