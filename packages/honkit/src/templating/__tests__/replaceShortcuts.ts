import Immutable from "immutable";

import TemplateBlock from "../../models/templateBlock";
import replaceShortcuts from "../replaceShortcuts";

describe("replaceShortcuts", () => {
    const blocks = Immutable.List([
        TemplateBlock.create("math", {
            shortcuts: {
                start: "$$",
                end: "$$",
                parsers: ["markdown"],
            },
        }),
    ]);

    test("should correctly replace inline matches by block", () => {
        const content = replaceShortcuts(blocks, "test.md", "Hello $$a = b$$");
        expect(content).toBe("Hello {% math %}a = b{% endmath %}");
    });

    test("should correctly replace block matches", () => {
        const content = replaceShortcuts(blocks, "test.md", "Hello\n$$\na = b\n$$\n");
        expect(content).toBe("Hello\n{% math %}\na = b\n{% endmath %}\n");
    });
});
