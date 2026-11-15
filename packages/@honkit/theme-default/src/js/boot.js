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
                    "HonKit: jQuery is not loaded yet. Use $(function () { ... }) or require([\"jquery\"], function ($) { ... })"
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
    function getSidebarState(defaultValue) {
        const key = ":sidebar";
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
        const sidebarState = getSidebarState(true);
        const book = document.querySelector(".book");
        // Show sidebar if it enabled
        if (sidebarState && book) {
            book.classList.add("without-animation", "with-summary");
        }
    }

    try {
        restoreLastSidebarState();
    } finally {
        const book = document.querySelector(".book");
        if (book) {
            book.classList.remove("honkit-cloak");
        }
    }
})();
