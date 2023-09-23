import encodeFile from "./encodeFile";

/**
 Encode a languages listing to JSON

 @param {Languages}
 @return {Object}
 */

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
                    title: lang.getTitle()
                };
            })
            .toJS()
    };
}

export default encodeLanguages;
