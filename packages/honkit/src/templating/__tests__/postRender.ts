import TemplateEngine from "../../models/templateEngine";
import TemplateBlock from "../../models/templateBlock";
import renderTemplate from "../render";
import postRender from "../postRender";

describe("postRender", () => {
    let testPost;
    
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
    const engine = TemplateEngine.create({
        blocks: [
            
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
            TemplateBlock.create("lower", (blk) => {
                return blk.body.toLowerCase();
            }),
            
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
            TemplateBlock.create("prefix", (blk) => {
                return {
                    body: `_${blk.body}_`,
                    post: function() {
                        testPost = true;
                    }
                };
            })
        ]
    });

    test("should correctly replace block", () => {
        
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
        return renderTemplate(engine, "README.md", "Hello {% lower %}Samy{% endlower %}")
            .then((output) => {
                expect(output.getContent()).toMatch(/Hello \{\{\-([\S]+)\-\}\}/);
                expect(output.getBlocks().size).toBe(1);

                return postRender(engine, output);
            })
            .then((result) => {
                expect(result).toBe("Hello samy");
            });
    });

    test("should correctly replace blocks", () => {
        
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
        return renderTemplate(
            engine,
            "README.md",
            "Hello {% lower %}Samy{% endlower %}{% prefix %}Pesse{% endprefix %}"
        )
            .then((output) => {
                expect(output.getContent()).toMatch(/Hello \{\{\-([\S]+)\-\}\}\{\{\-([\S]+)\-\}\}/);
                expect(output.getBlocks().size).toBe(2);
                return postRender(engine, output);
            })
            .then((result) => {
                expect(result).toBe("Hello samy_Pesse_");
                expect(testPost).toBe(true);
            });
    });
});
