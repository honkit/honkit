import Immutable from "immutable";

import Token from "../../models/token";
import STYLES from "../../constants/styles";
import mergeTokens from "../mergeTokens";

describe("mergeTokens", () => {
    it("should merge two tokens", () => {
        const tokens = Immutable.List([Token.createText("Hello "), Token.createText("world")]);

        const merged = mergeTokens(tokens, [STYLES.TEXT]);
        merged.size.should.equal(1);

        const resultToken = merged.get(0);
        resultToken.getType().should.equal(STYLES.TEXT);
        resultToken.getText().should.equal("Hello world");
    });

    it("should merge three tokens", () => {
        const tokens = Immutable.List([Token.createText("Hello "), Token.createText("world"), Token.createText("!")]);

        const merged = mergeTokens(tokens, [STYLES.TEXT]);
        merged.size.should.equal(1);

        const resultToken = merged.get(0);
        resultToken.getType().should.equal(STYLES.TEXT);
        resultToken.getText().should.equal("Hello world!");
    });

    it("should merge 2x2 tokens", () => {
        const tokens = Immutable.List([
            Token.createText("Hello "),
            Token.createText("world"),
            // @ts-ignore
            new Token({
                type: STYLES.BOLD,
                text: ", right?",
            }),
            Token.createText("!"),
            Token.createText("!"),
        ]);

        const merged = mergeTokens(tokens, [STYLES.TEXT]);
        merged.size.should.equal(3);

        const first = merged.get(0);
        const bold = merged.get(1);
        const second = merged.get(2);

        first.getType().should.equal(STYLES.TEXT);
        first.getText().should.equal("Hello world");

        bold.getType().should.equal(STYLES.BOLD);
        bold.getText().should.equal(", right?");

        second.getType().should.equal(STYLES.TEXT);
        second.getText().should.equal("!!");
    });
});
