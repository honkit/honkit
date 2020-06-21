module.exports = {
    modifyHTML: require("./modifyHTML"),
    inlineAssets: require("./inlineAssets"),

    // HTML transformations
    addHeadingId: require("./addHeadingId"),
    svgToImg: require("./svgToImg"),
    fetchRemoteImages: require("./fetchRemoteImages"),
    resolveLinks: require("./resolveLinks"),
    resolveImages: require("./resolveImages"),
    annotateText: require("./annotateText"),
    highlightCode: require("./highlightCode"),
};
