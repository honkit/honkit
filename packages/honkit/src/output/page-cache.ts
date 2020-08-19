const flatCache = require("flat-cache");
module.exports.getCache = () => {
    return flatCache.create("honkit");
};
module.exports.clearCache = () => {
    return flatCache.clearCacheById("honkit");
};
