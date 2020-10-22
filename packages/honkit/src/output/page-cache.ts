import flatCache from "flat-cache";

export const getCache = () => {
    return flatCache.create("honkit-3.6.7");
};

export const clearCache = () => {
    return flatCache.clearCacheById("honkit-3.6.7");
};
