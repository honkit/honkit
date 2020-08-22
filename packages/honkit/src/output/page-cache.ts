import flatCache from "flat-cache";

export const getCache = () => {
    return flatCache.create("honkit");
};

export const clearCache = () => {
    return flatCache.clearCacheById("honkit");
};
