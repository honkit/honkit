import Token from "../token";
import STYLES from "../../constants/styles";

describe("Token", () => {
    describe(".mergeWith", () => {
        it("should merge text and raw", () => {
            const base = Token.createText("Hello ");
            const other = Token.createText("world");

            const token = base.mergeWith(other);
            token.getType().should.equal(STYLES.TEXT);
            token.getText().should.equal("Hello world");
        });
    });
});
