var GlossaryEntry = require("../glossaryEntry");

describe("GlossaryEntry", () => {
    describe("getID", () => {
        test("must return a normalized ID", () => {
            var entry = new GlossaryEntry({
                name: "Hello World",
            });

            expect(entry.getID()).toBe("hello-world");
        });
    });
});
