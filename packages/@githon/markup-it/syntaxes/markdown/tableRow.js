const MarkupIt = require("../../");

const reTable = require("./re/table");
const inlineRules = require("./inline");
const utils = require("./utils");

const CELL_SEPARATOR = "cell";

/*
 * Custom inline syntax to parse each row with custom cell separator tokens
 */
const rowRules = inlineRules
    .unshift(
        MarkupIt.Rule(CELL_SEPARATOR).regExp(reTable.cellSeparation, (match) => {
            return {
                raw: match[0],
            };
        })
    )
    .replace(
        MarkupIt.Rule(MarkupIt.STYLES.TEXT)
            .regExp(reTable.cellInlineEscape, (state, match) => {
                const text = utils.unescape(match[0]);
                return { text: text };
            })
            .regExp(reTable.cellInlineText, (state, match) => {
                const text = utils.unescape(match[0]);
                return { text: text };
            })
            .toText(utils.escape)
    );

/**
 * Parse a row from a table
 *
 * @param {ParsingState} state
 * @param {String} text
 * @return {Token}
 */
function parseRow(state, text) {
    const cells = [];
    let accu = [];
    const tokens = state.parse(rowRules, true, text);

    function pushCell() {
        if (accu.length == 0) {
            return;
        }

        const cell = MarkupIt.Token.create(MarkupIt.BLOCKS.TABLE_CELL, {
            tokens: accu,
        });

        cells.push(cell);
        accu = [];
    }

    tokens.forEach((token) => {
        if (token.getType() == CELL_SEPARATOR) {
            pushCell();
        } else {
            accu.push(token);
        }
    });
    pushCell();

    return MarkupIt.Token.create(MarkupIt.BLOCKS.TABLE_ROW, {
        tokens: cells,
    });
}

module.exports = {
    parse: parseRow,
};
