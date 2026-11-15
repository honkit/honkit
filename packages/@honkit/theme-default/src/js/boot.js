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

    /*
        Apply the font settings that the reader saved (src/js/theme/fontsettings.js) before the page is shown.
        The classes of the config are rendered in page.html, and only the reader's choice is in localStorage.
        theme.js is loaded with `defer` and runs after the first paint: without this,
        the text changes its size (layout shift) and a night theme reader sees the white theme first.
        theme.js applies the same classes again when it runs.
    */
    function restoreFontSettings(book) {
        const fontState = getStorageValue(":fontState", null);
        if (!fontState) {
            // The reader has not changed the font settings
            return;
        }
        book.className = book.className.replace(/\b(font|color-theme)-\S+/g, "");
        book.classList.add("font-size-" + fontState.size, "font-family-" + fontState.family);
        if (fontState.theme !== 0) {
            book.classList.add("color-theme-" + fontState.theme);
        }
    }

    // Show the page even if restoring the last state throws. The error is not caught, so it is reported in the console
    try {
        restoreLastSidebarState();
        restoreFontSettings(document.querySelector(".book"));
    } finally {
        const book = document.querySelector(".book");
        if (book) {
            book.classList.remove("honkit-cloak");
        }
    }
})();
