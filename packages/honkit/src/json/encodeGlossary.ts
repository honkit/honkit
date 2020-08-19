// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeFile... Remove this comment to see the full error message
const encodeFile = require("./encodeFile");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeGlos... Remove this comment to see the full error message
const encodeGlossaryEntry = require("./encodeGlossaryEntry");

/**
    Encode a glossary to JSON

    @param {Glossary}
    @return {Object}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeGlos... Remove this comment to see the full error message
function encodeGlossary(glossary) {
    const file = glossary.getFile();
    const entries = glossary.getEntries();

    return {
        file: encodeFile(file),
        entries: entries.map(encodeGlossaryEntry).toJS(),
    };
}

module.exports = encodeGlossary;
