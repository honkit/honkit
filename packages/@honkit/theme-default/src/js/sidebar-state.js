/*
    Restore the last state of the sidebar before the page is shown.
    This script is loaded synchronously right after `.book`, so that the sidebar
    does not move after the first paint (layout shift).
    https://web.dev/optimize-cls/
*/
(function () {
    // Same key and format as `gitbook.storage` (src/js/core/storage.js)
    function getSidebarState(defaultValue) {
        var key = ":sidebar";
        try {
            var value = localStorage[key];
            if (value === undefined) {
                return defaultValue;
            }
            var parsed = JSON.parse(value);
            return parsed == null ? defaultValue : parsed;
        } catch (e) { // eslint-disable-line no-unused-vars
            return defaultValue;
        }
    }

    function restoreLastSidebarState() {
        var isMobile = window.matchMedia("(max-width: 600px)").matches;
        if (isMobile) {
            // The sidebar is closed by default on mobile
            return;
        }
        var sidebarState = getSidebarState(true);
        var book = document.querySelector(".book");
        // Show sidebar if it enabled
        if (sidebarState && book) {
            book.classList.add("without-animation", "with-summary");
        }
    }

    try {
        restoreLastSidebarState();
    } finally {
        var book = document.querySelector(".book");
        if (book) {
            book.classList.remove("honkit-cloak");
        }
    }
})();
