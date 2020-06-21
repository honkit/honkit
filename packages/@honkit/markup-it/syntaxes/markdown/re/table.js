const replace = require("../utils").replace;
const inline = require("./inline");

const pipe = /\|/;

const table = {
    cellSeparation: /^pipe/,

    nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
    normal: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/,

    // Split a row into cells
    cell: / *pipe */,

    // Replace trailing pipe
    trailingPipe: /^ *| *pipe *$/g,

    // Remove trailing pipe of align
    trailingPipeAlign: /^ *|pipe *$/g,

    // Remove trailing pipe of cell
    trailingPipeCell: /(?: *pipe *)?\n$/,

    // Remove edge pipes of a cell
    edgePipesCell: /^ *pipe *| *pipe *$/g,

    // Alignements
    alignRight: /^ *-+: *$/,
    alignCenter: /^ *:-+: *$/,
    alignLeft: /^ *:-+ *$/,
};

table.cellSeparation = replace(table.cellSeparation)(/pipe/g, pipe)();
table.cell = replace(table.cell)(/pipe/g, pipe)();
table.trailingPipe = replace(table.trailingPipe, "g")(/pipe/g, pipe)();
table.trailingPipeAlign = replace(table.trailingPipeAlign, "g")(/pipe/g, pipe)();
table.trailingPipeCell = replace(table.trailingPipeCell, "g")(/pipe/g, pipe)();
table.edgePipesCell = replace(table.edgePipesCell, "g")(/pipe/g, pipe)();
table.cellInlineText = replace(inline.text)("]|", "|]|")();
table.cellInlineEscape = inline.escape;

module.exports = table;
