import nunjucks from "nunjucks";
import Immutable from "immutable";
import PromiseUtil from "../../utils/promise";
import TemplateBlock from "../templateBlock";
describe("TemplateBlock", () => {
    describe("create", () => {
        test("must initialize a simple TemplateBlock from a function", () => {
            const templateBlock = TemplateBlock.create("sayhello", (block) => {
                return {
                    body: "<p>Hello, World!</p>",
                    parse: true,
                };
            });

            // Check basic templateBlock properties
            expect(templateBlock.getName()).toBe("sayhello");
            expect(templateBlock.getEndTag()).toBe("endsayhello");
            expect(templateBlock.getBlocks().size).toBe(0);
            expect(templateBlock.getExtensionName()).toBe("BlocksayhelloExtension");

            // Check result of applying block
            return PromiseUtil()
                .then(() => {
                    return templateBlock.applyBlock();
                })
                .then((result) => {
                    expect(result.name).toBe("sayhello");
                    expect(result.body).toBe("<p>Hello, World!</p>");
                });
        });
    });

    describe("getShortcuts", () => {
        test("must return undefined if no shortcuts", () => {
            const templateBlock = TemplateBlock.create("sayhello", (block) => {
                return {
                    body: "<p>Hello, World!</p>",
                    parse: true,
                };
            });

            expect(templateBlock.getShortcuts()).toBeFalsy();
        });

        test("must return complete shortcut", () => {
            const templateBlock = TemplateBlock.create("sayhello", {
                process: function (block) {
                    return "<p>Hello, World!</p>";
                },
                shortcuts: {
                    parsers: ["markdown"],
                    start: "$",
                    end: "-",
                },
            });

            const shortcut = templateBlock.getShortcuts();

            expect(shortcut).toBeDefined();
            expect(shortcut.getStart()).toEqual("$");
            expect(shortcut.getEnd()).toEqual("-");
            expect(shortcut.getStartTag()).toEqual("sayhello");
            expect(shortcut.getEndTag()).toEqual("endsayhello");
        });
    });

    describe("toNunjucksExt()", () => {
        test("should replace by block anchor", () => {
            const templateBlock = TemplateBlock.create("sayhello", (block) => {
                return "Hello";
            });

            let blocks: any = {};

            // Create a fresh Nunjucks environment
            const env = new nunjucks.Environment(null, { autoescape: false });

            // Add template block to environement
            const Ext = templateBlock.toNunjucksExt({}, blocks);
            env.addExtension(templateBlock.getExtensionName(), new Ext());

            // Render a template using the block
            const src = "{% sayhello %}{% endsayhello %}";
            return PromiseUtil.nfcall(env.renderString.bind(env), src).then((res) => {
                blocks = Immutable.fromJS(blocks);
                expect(blocks.size).toBe(1);
                const blockId = blocks.keySeq().get(0);
                const block = blocks.get(blockId);

                expect(res).toBe(`{{-%${blockId}%-}}`);
                expect(block.get("body")).toBe("Hello");
                expect(block.get("name")).toBe("sayhello");
            });
        });

        test("must create a valid nunjucks extension", () => {
            const templateBlock = TemplateBlock.create("sayhello", (block) => {
                return {
                    body: "<p>Hello, World!</p>",
                    parse: true,
                };
            });

            // Create a fresh Nunjucks environment
            const env = new nunjucks.Environment(null, { autoescape: false });

            // Add template block to environement
            const Ext = templateBlock.toNunjucksExt();
            env.addExtension(templateBlock.getExtensionName(), new Ext());

            // Render a template using the block
            const src = "{% sayhello %}{% endsayhello %}";
            return PromiseUtil.nfcall(env.renderString.bind(env), src).then((res) => {
                expect(res).toBe("<p>Hello, World!</p>");
            });
        });

        test("must apply block arguments correctly", () => {
            const templateBlock = TemplateBlock.create("sayhello", (block) => {
                return {
                    body: `<${block.kwargs.tag}>Hello, ${block.kwargs.name}!</${block.kwargs.tag}>`,
                    parse: true,
                };
            });

            // Create a fresh Nunjucks environment
            const env = new nunjucks.Environment(null, { autoescape: false });

            // Add template block to environement
            const Ext = templateBlock.toNunjucksExt();
            env.addExtension(templateBlock.getExtensionName(), new Ext());

            // Render a template using the block
            const src = '{% sayhello name="Samy", tag="p" %}{% endsayhello %}';
            return PromiseUtil.nfcall(env.renderString.bind(env), src).then((res) => {
                expect(res).toBe("<p>Hello, Samy!</p>");
            });
        });

        test("must accept an async function", () => {
            const templateBlock = TemplateBlock.create("sayhello", (block) => {
                return PromiseUtil().then(() => {
                    return {
                        body: `Hello ${block.body}`,
                        parse: true,
                    };
                });
            });

            // Create a fresh Nunjucks environment
            const env = new nunjucks.Environment(null, { autoescape: false });

            // Add template block to environement
            const Ext = templateBlock.toNunjucksExt();
            env.addExtension(templateBlock.getExtensionName(), new Ext());

            // Render a template using the block
            const src = "{% sayhello %}Samy{% endsayhello %}";
            return PromiseUtil.nfcall(env.renderString.bind(env), src).then((res) => {
                expect(res).toBe("Hello Samy");
            });
        });

        test("must handle nested blocks", () => {
            const templateBlock = new TemplateBlock({
                name: "yoda",
                blocks: Immutable.List(["start", "end"]),
                process: function (block) {
                    const nested: { end?: any; start?: any } = {};

                    block.blocks.forEach((blk) => {
                        nested[blk.name] = blk.body.trim();
                    });

                    return {
                        body: `<p class="yoda">${nested.end} ${nested.start}</p>`,
                        parse: true,
                    };
                },
            });

            // Create a fresh Nunjucks environment
            const env = new nunjucks.Environment(null, { autoescape: false });

            // Add template block to environement
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'toNunjucksExt' does not exist on type 'M... Remove this comment to see the full error message
            const Ext = templateBlock.toNunjucksExt();
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'getExtensionName' does not exist on type... Remove this comment to see the full error message
            env.addExtension(templateBlock.getExtensionName(), new Ext());

            // Render a template using the block
            const src = "{% yoda %}{% start %}this sentence should be{% end %}inverted{% endyoda %}";
            return PromiseUtil.nfcall(env.renderString.bind(env), src).then((res) => {
                expect(res).toBe('<p class="yoda">inverted this sentence should be</p>');
            });
        });
    });
});
