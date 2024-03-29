/**
 Return a JSON representation of a file

 @param {File} file
 @return {Object}
 */
function encodeFileToJson(file) {
    const filePath = file.getPath();
    if (!filePath) {
        return undefined;
    }

    return {
        path: filePath,
        mtime: file.getMTime(),
        type: file.getType()
    };
}

export default encodeFileToJson;
