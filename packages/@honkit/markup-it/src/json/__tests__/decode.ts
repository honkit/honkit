import decode from "../decode";
import BLOCKS from "../../constants/blocks";

describe("decode", () => {
    let content;

    beforeAll(() => {
        content = decode({
            syntax: "mysyntax",
            token: {
                type: BLOCKS.DOCUMENT,
                tokens: [
                    {
                        type: BLOCKS.PARAGRAPH,
                        text: "Hello World",
                        raw: "Hello World",
                    },
                ],
            },
        });
    });

    it("should decode syntax name", () => {
        content.getSyntax().should.equal("mysyntax");
    });

    it("should decode tokens tree", () => {
        const doc = content.getToken();
        const tokens = doc.getTokens();
        tokens.size.should.equal(1);

        const p = tokens.get(0);
        p.getType().should.equal(BLOCKS.PARAGRAPH);
        p.getText().should.equal("Hello World");
        p.getRaw().should.equal("Hello World");
        p.getTokens().size.should.equal(0);
    });
});
