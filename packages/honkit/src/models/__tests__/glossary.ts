import File from "../file";
import Glossary from "../glossary";
import GlossaryEntry from "../glossaryEntry";

describe("Glossary", () => {

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromEntries' does not exist on typ... Remove this comment to see the full error message
    const glossary = Glossary.createFromEntries(File(), [
        {
            name: "Hello World",
            description: "Awesome!"
        },
        {
            name: "JavaScript",
            description: "This is a cool language"
        }
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
