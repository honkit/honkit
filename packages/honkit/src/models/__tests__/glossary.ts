import File from "../file";
import Glossary from "../glossary";
import GlossaryEntry from "../glossaryEntry";

describe("Glossary", () => {
    const glossary = Glossary.createFromEntries(new File(), [
        {
            name: "Hello World",
            description: "Awesome!",
        },
        {
            name: "JavaScript",
            description: "This is a cool language",
        },
    ]);

    describe("createFromEntries", () => {
        test("must add all entries", () => {
            const entries = glossary.getEntries();
            expect(entries.size).toBe(2);
        });

        test("must add entries as GlossaryEntries", () => {
            const entries = glossary.getEntries();
            const entry = entries.get("hello-world");
            expect(entry instanceof GlossaryEntry).toBeTruthy();
        });
    });

    describe("toText", () => {
        test("return as markdown", () => {
            return glossary.toText(".md").then((text) => {
                expect(text).toContain("# Glossary");
            });
        });
    });
});
