const Immutable = require("immutable");
const MarkupIt = require("../../");

const reTable = require("./re/table");
const tableRow = require("./tableRow");

const ALIGN = {
    LEFT: "left",
    RIGHT: "right",
    CENTER: "center",
};

/**
 * Create a table entity from parsed header/rows
 *
 * @param {ParsingState} state
 * @param {Array} header
 * @param {Array<String>} align
 * @param {Array<Array>} rows
 * @rteturn {Object} tokenMatch
 */
function Table(state, header, align, rows) {
    const headerRow = tableRow.parse(state, header);
    const rowTokens = rows.map((row) => {
        return tableRow.parse(state, row);
    });

    return {
        data: {
            align: align,
        },
        tokens: Immutable.List([headerRow]).concat(rowTokens),
    };
}

/**
 * Detect alignement per column
 *
 * @param {Array<String>}
 * @return {Array<String|null>}
 */
function mapAlign(align) {
    return align.map((s) => {
        if (reTable.alignRight.test(s)) {
            return ALIGN.RIGHT;
        } else if (reTable.alignCenter.test(s)) {
            return ALIGN.CENTER;
        } else if (reTable.alignLeft.test(s)) {
            return ALIGN.LEFT;
        } else {
            return null;
        }
    });
}

/**
 * Render align to text
 *
 * @param {Array<String>} row
 * @return {String}
 */
function alignToText(row) {
    return `|${row
        .map((align) => {
            if (align == "right") {
                return " ---: |";
            } else if (align == "left") {
                return " :--- |";
            } else if (align == "center") {
                return " :---: |";
            } else {
                return " --- |";
            }
        })
        .join("")}`;
}

const blockRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE)

    // Table no leading pipe (gfm)
    .regExp(reTable.nptable, (state, match) => {
        const header = match[1];
        let align = match[2].replace(reTable.trailingPipeAlign, "").split(reTable.cell);
        const rows = match[3].replace(/\n$/, "").split("\n");

        // Align for columns
        align = mapAlign(align);

        return Table(state, header, align, rows);
    })

    // Normal table
    .regExp(reTable.normal, (state, match) => {
        const header = match[1];
        let align = match[2].replace(reTable.trailingPipeAlign, "").split(reTable.cell);
        const rows = match[3].replace(reTable.trailingPipeCell, "").replace(/\n$/, "").split("\n");

        // Align for columns
        align = mapAlign(align);

        return Table(state, header, align, rows);
    })

    .toText((state, token) => {
        const data = token.getData();
        const rows = token.getTokens();
        let align = data.get("align");

        const headerRows = rows.slice(0, 1);
        const bodyRows = rows.slice(1);
        const headerRow = headerRows.get(0);
        const countCells = headerRow.getTokens().size;

        align = align || [];
        align = Array.apply(null, Array(countCells)).map((v, i) => {
            return align[i] || ALIGN.LEFT;
        });

        const headerText = state.render(headerRows);
        const bodyText = state.render(bodyRows);

        return `${headerText + alignToText(align)}\n${bodyText}\n`;
    });

const rowRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_ROW).toText((state, token) => {
    const innerContent = state.render(token);
    return `|${innerContent}\n`;
});

const cellRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_CELL).toText((state, token) => {
    const innerContent = state.render(token);
    return ` ${innerContent.trim()} |`;
});

module.exports = {
    block: blockRule,
    cell: cellRule,
    row: rowRule,
};
