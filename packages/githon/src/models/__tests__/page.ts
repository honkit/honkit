import Immutable from "immutable";

import Page from "../page";

describe("Page", () => {
    describe("toText", () => {
        test("must not prepend frontmatter if no attributes", () => {
            const page = Page().merge({
                content: "Hello World",
            });

            // @ts-expect-error
            expect(page.toText()).toBe("Hello World");
        });

        test("must prepend frontmatter if attributes", () => {
            const page = Page().merge({
                content: "Hello World",
                attributes: Immutable.fromJS({
                    hello: "world",
                }),
            });
            // @ts-expect-error
            expect(page.toText()).toBe("---\nhello: world\n---\n\nHello World");
        });
    });
});
