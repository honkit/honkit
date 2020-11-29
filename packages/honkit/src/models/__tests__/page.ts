import Immutable from "immutable";

import Page from "../page";

describe("Page", () => {
    describe("toText", () => {
        test("must not prepend frontmatter if no attributes", () => {
            const page = new Page().merge({
                content: "Hello World",
            }) as Page;
            expect(page.toText()).toBe("Hello World");
        });

        test("must prepend frontmatter if attributes", () => {
            const page = new Page().merge({
                content: "Hello World",
                attributes: Immutable.fromJS({
                    hello: "world",
                }),
            }) as Page;
            expect(page.toText()).toBe("---\nhello: world\n---\n\nHello World");
        });
    });
});
