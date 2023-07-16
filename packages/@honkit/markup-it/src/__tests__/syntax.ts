// @ts-ignore
import * as MarkupIt from "..";

describe("Custom Syntax", () => {
    const syntax = MarkupIt.Syntax("mysyntax", {
        inline: [
            MarkupIt.Rule(MarkupIt.STYLES.BOLD)
                .regExp(/^\*\*([\s\S]+?)\*\*/, (state, match) => {
                    return {
                        text: match[1],
                    };
                })
                .toText("**%s**"),
        ],
    });
    const markup = new MarkupIt.Markup(syntax);

    describe(".toContent", () => {
        it("should return correct syntax name", () => {
            const content = markup.toContent("Hello");
            content.getSyntax().should.equal("mysyntax");
        });

        it("should parse as unstyled", () => {
            const content = markup.toContent("Hello World");

            const doc = content.getToken();
            const blocks = doc.getTokens();

            blocks.size.should.equal(1);
            const p = blocks.get(0);

            p.getType().should.equal(MarkupIt.BLOCKS.TEXT);
            p.getAsPlainText().should.equal("Hello World");
        });

        it("should parse inline", () => {
            const content = markup.toContent("Hello **World**");
            const doc = content.getToken();
            const blocks = doc.getTokens();

            blocks.size.should.equal(1);
            const p = blocks.get(0);

            p.getType().should.equal(MarkupIt.BLOCKS.TEXT);
            p.getAsPlainText().should.equal("Hello World");
        });
    });

    describe(".toText", () => {
        it("should output correct string", () => {
            const content = MarkupIt.JSONUtils.decode({
                syntax: "mysyntax",
                token: {
                    type: MarkupIt.BLOCKS.DOCUMENT,
                    tokens: [
                        {
                            type: MarkupIt.BLOCKS.PARAGRAPH,
                            tokens: [
                                {
                                    type: MarkupIt.STYLES.TEXT,
                                    text: "Hello ",
                                },
                                {
                                    type: MarkupIt.STYLES.BOLD,
                                    text: "World",
                                },
                            ],
                        },
                    ],
                },
            });
            const text = markup.toText(content);
            text.should.equal("Hello **World**\n");
        });
    });
});
