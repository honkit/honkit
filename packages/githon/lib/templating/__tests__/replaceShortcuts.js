var Immutable = require("immutable");

var TemplateBlock = require("../../models/templateBlock");
var replaceShortcuts = require("../replaceShortcuts");

describe("replaceShortcuts", () => {
    var blocks = Immutable.List([
        TemplateBlock.create("math", {
            shortcuts: {
                start: "$$",
                end: "$$",
                parsers: ["markdown"],
            },
        }),
    ]);

    test("should correctly replace inline matches by block", () => {
        var content = replaceShortcuts(blocks, "test.md", "Hello $$a = b$$");
        expect(content).toBe("Hello {% math %}a = b{% endmath %}");
    });

    test("should correctly replace block matches", () => {
        var content = replaceShortcuts(blocks, "test.md", "Hello\n$$\na = b\n$$\n");
        expect(content).toBe("Hello\n{% math %}\na = b\n{% endmath %}\n");
    });
});
