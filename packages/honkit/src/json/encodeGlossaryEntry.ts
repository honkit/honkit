/**
    Encode a SummaryArticle to JSON

    @param {GlossaryEntry}
    @return {Object}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeGlos... Remove this comment to see the full error message
function encodeGlossaryEntry(entry) {
    return {
        id: entry.getID(),
        name: entry.getName(),
        description: entry.getDescription(),
    };
}

module.exports = encodeGlossaryEntry;
