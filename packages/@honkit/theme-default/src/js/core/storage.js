let baseKey = "";

/*
 * Simple module for storing data in the browser's local storage
 */
module.exports = {
    setBaseKey: function (key) {
        baseKey = key;
    },

    // Write something in localstorage
    set: function (key, value) {
        key = baseKey + ":" + key;

        try {
            localStorage[key] = JSON.stringify(value);
        } catch {
            // localStorage is unavailable (e.g. cookies are disabled): ignore
        }
    },

    // Read a value from localstorage
    get: function (key, def) {
        let value;
        key = baseKey + ":" + key;
        // We need a try block here because window.localStorage is
        // inaccessible when browser cookies are disabled.
        try {
            value = localStorage[key];
        } catch {
            // localStorage is unavailable (e.g. cookies are disabled): ignore
        }

        if (value === undefined) return def;

        try {
            const parsed = JSON.parse(value);
            return parsed == null ? def : parsed;
        } catch {
            return value || def;
        }
    },

    // Remove a key from localstorage
    remove: function (key) {
        key = baseKey + ":" + key;
        try {
            localStorage.removeItem(key);
        } catch {
            // localStorage is unavailable (e.g. cookies are disabled): ignore
        }
    },
};
