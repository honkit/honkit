/*
    The only script of the theme that is loaded synchronously (right after `.book`).

    1. Restore the last state of the sidebar before the page is shown, so that the sidebar
       does not move after the first paint (layout shift). https://web.dev/optimize-cls/
    2. gitbook.js, theme.js and the plugin scripts are loaded with `defer`. Until gitbook.js runs,
       queue the calls of inline scripts that use the plugin API:
       `gitbook.push(fn)`, `require([...], fn)` and `$(fn)` / `jQuery(fn)`.
*/
(function () {
    if (!window.jQuery) {
        const queue = (window.__honkitBootQueue = window.__honkitBootQueue || []);
        const queueReady = function (fn) {
            if (typeof fn !== "function") {
                throw new Error(
                    'HonKit: jQuery is not loaded yet. Use $(function () { ... }) or require(["jquery"], function ($) { ... })'
                );
            }
            queue.push({ type: "ready", fn: fn });
        };
        window.$ = window.jQuery = queueReady;
        if (!window.require) {
            window.require = function (modules, fn) {
                queue.push({ type: "require", modules: modules, fn: fn });
            };
        }
    }
    window.gitbook = window.gitbook || [];
    if (Array.isArray(window.gitbook)) {
        // gitbook.js queues `gitbook.page.hasChanged()` of the page context at this position:
        // after the functions pushed before `.book` and before the ones pushed by the following scripts
        window.__honkitPageContextIndex = window.gitbook.length;
    }
})();

(function () {
    // Same key and format as `gitbook.storage` (src/js/core/storage.js)
    function getStorageValue(key, defaultValue) {
        try {
            const value = localStorage[key];
            if (value === undefined) {
                return defaultValue;
            }
            const parsed = JSON.parse(value);
            return parsed == null ? defaultValue : parsed;
        } catch {
            return defaultValue;
        }
    }

    function restoreLastSidebarState() {
        const isMobile = window.matchMedia("(max-width: 600px)").matches;
        if (isMobile) {
            // The sidebar is closed by default on mobile
            return;
        }
        const sidebarState = getStorageValue(":sidebar", true);
        const book = document.querySelector(".book");
        // Show sidebar if it enabled
        if (sidebarState && book) {
            book.classList.add("without-animation", "with-summary");
        }
    }

    function getPageConfig() {
        const element = document.getElementById("honkit-page-context");
        if (!element) {
            return null;
        }
        const context = JSON.parse(element.textContent);
        return context && context.config;
    }

    /*
        Apply the classes of honkit-plugin-fontsettings (font size, font family and color theme) before the page is shown.
        fontsettings.js is loaded with `defer` and runs after the first paint: when it adds the classes,
        the text changes its size (layout shift) and a night theme user sees the white theme first.
        This is the same logic as `init()` in fontsettings.js, and fontsettings.js applies the classes again when it runs.
    */
    function restoreFontSettings(config) {
        const pluginConfig = config && config.pluginsConfig && config.pluginsConfig.fontsettings;
        if (!pluginConfig) {
            // fontsettings plugin is not used
            return;
        }
        const themeIds = { white: 0, sepia: 1, night: 2 };
        const familyIds = { serif: 0, sans: 1 };
        const fontState = getStorageValue(":fontState", {
            size: pluginConfig.size || 2,
            family: familyIds[pluginConfig.family] || 0,
            theme: themeIds[pluginConfig.theme] || 0
        });
        const book = document.querySelector(".book");
        if (!book || typeof fontState !== "object") {
            return;
        }
        book.classList.add("font-size-" + fontState.size, "font-family-" + fontState.family);
        if (fontState.theme !== 0) {
            book.classList.add("color-theme-" + fontState.theme);
        }
    }

    // Show the page even if restoring the last state throws. The error is not caught, so it is reported in the console
    try {
        restoreLastSidebarState();
        restoreFontSettings(getPageConfig());
    } finally {
        const book = document.querySelector(".book");
        if (book) {
            book.classList.remove("honkit-cloak");
        }
    }
})();
