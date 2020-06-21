import TemplateEngine from "../../models/templateEngine";
import TemplateBlock from "../../models/templateBlock";

import renderTemplate from "../render";
import postRender from "../postRender";

describe("postRender", () => {
    let testPost;
    // @ts-expect-error
    const engine = TemplateEngine.create({
        blocks: [
            // @ts-expect-error
            TemplateBlock.create("lower", (blk) => {
                return blk.body.toLowerCase();
            }),
            // @ts-expect-error
            TemplateBlock.create("prefix", (blk) => {
                return {
                    body: `_${blk.body}_`,
                    post: function () {
                        testPost = true;
                    },
                };
            }),
        ],
    });

    test("should correctly replace block", () => {
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
