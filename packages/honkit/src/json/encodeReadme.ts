// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeFile... Remove this comment to see the full error message
const encodeFile = require("./encodeFile");

/**
    Encode a readme to JSON

    @param {Readme}
    @return {Object}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeRead... Remove this comment to see the full error message
function encodeReadme(readme) {
    const file = readme.getFile();

    return {
        file: encodeFile(file),
    };
}

module.exports = encodeReadme;
