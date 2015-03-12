var blocks = require('./annotate_blocks');
var inline = require('./annotate_inline');

function annotate(src) {
    return blocks(src);
}

module.exports = annotate;
module.exports.blocks = blocks;
module.exports.inline = inline;
