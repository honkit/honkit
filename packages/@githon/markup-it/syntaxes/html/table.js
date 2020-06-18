const MarkupIt = require("../../");

const blockRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE).toText((state, token) => {
    state._rowIndex = 0;

    const data = token.getData();
    const rows = token.getTokens();
    const align = data.get("align");

    const headerRows = rows.slice(0, 1);
    const bodyRows = rows.slice(1);

    state._tableAlign = align;

    const headerText = state.render(headerRows);
    const bodyText = state.render(bodyRows);

    return `${"<table>\n" + "<thead>\n"}${headerText}</thead>` + `<tbody>\n${bodyText}</tbody>` + "</table>\n\n";
});

const rowRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_ROW).toText((state, token) => {
    const innerContent = state.render(token);
    state._rowIndex = state._rowIndex + 1;
    state._cellIndex = 0;

    return `<tr>${innerContent}</tr>`;
});

const cellRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_CELL).toText((state, token) => {
    const align = state._tableAlign[state._cellIndex];
    const isHeader = (state._rowIndex || 0) === 0;
    const innerHTML = state.render(token);

    const type = isHeader ? "th" : "td";
    const tag = align ? `<${type} style="text-align:${align}">` : `<${type}>`;

    state._cellIndex = state._cellIndex + 1;

    return `${tag + innerHTML}</${type}>\n`;
});

module.exports = {
    block: blockRule,
    row: rowRule,
    cell: cellRule,
};
