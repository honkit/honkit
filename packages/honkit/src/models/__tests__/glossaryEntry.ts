import GlossaryEntry from "../glossaryEntry";

describe("GlossaryEntry", () => {
    describe("getID", () => {
        test("must return a normalized ID", () => {
            const entry = new GlossaryEntry({
                name: "Hello World",
            });

            // @ts-expect-error
            expect(entry.getID()).toBe("hello-world");
        });
    });
});
