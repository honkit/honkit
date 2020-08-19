// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeFile... Remove this comment to see the full error message
const encodeFile = require("./encodeFile");

/**
    Encode a languages listing to JSON

    @param {Languages}
    @return {Object}
*/
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'encodeLang... Remove this comment to see the full error message
function encodeLanguages(languages) {
    const file = languages.getFile();
    const list = languages.getList();

    return {
        file: encodeFile(file),
        list: list
            .valueSeq()
            .map((lang) => {
                return {
                    id: lang.getID(),
                    title: lang.getTitle(),
                };
            })
            .toJS(),
    };
}

module.exports = encodeLanguages;
