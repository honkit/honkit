import Range from "range-utils";

/*
 * Walk throught the children tokens tree, and execute function
 * for each token with a text range relative to the base token
 *
 * It stops at block tokens
 *
 * @param {Token} base
 * @param {Function(token, range)} iter: function to call for each range of text
 * @return {string}
 */
function walk(base, iter) {
    let offset = 0;
    const tokens = base.getTokens();

    if (tokens.size === 0) {
        iter(base, Range(0, base.getText().length));

        return base.getText();
    }

    return tokens.reduce((output, token) => {
        if (token.isBlock()) {
            return output;
        }

        const innerText = walk(token, (tok, range) => {
            const realRange = Range.moveBy(range, offset);
            iter(tok, realRange);
        });

        iter(token, Range(offset, innerText.length));

        offset += innerText.length;
        return output + innerText;
    }, "");
}

export default walk;
