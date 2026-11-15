var $ = require("jquery");

var events = require("./events");
var storage = require("./storage");
var page = require("./page");

var isPageReady = false;
var onLoad = Array.isArray(window.gitbook) ? window.gitbook : [];

// Calls queued by boot.js while this script was loading with `defer`
var bootQueue = Array.isArray(window.__honkitBootQueue) ? window.__honkitBootQueue : [];
delete window.__honkitBootQueue;

// Export APIs for plugins
var honkit = {
    events: events,
    page: page,

    // Deprecated
    state: page.getState(),

    // Read/Write the localstorage
    storage: storage,

    // Push a function to be called once gitbook is ready
    push: function (fn) {
        if (!isPageReady) onLoad.push(fn);
        else fn();
    }
};

// Define `gitbook` as alias
var gitbook = honkit;

// Modules mapping for plugins
var MODULES = {
    gitbook: gitbook,
    honkit: honkit,
    jquery: $
};

window.gitbook = gitbook;
window.honkit = honkit;
window.$ = $;
window.jQuery = $;
window.require = function (mods, fn) {
    mods = mods.map(function (mod) {
        mod = mod.toLowerCase();
        if (!MODULES[mod]) {
            throw new Error("HonKit module " + mod + " doesn't exist");
        }

        return MODULES[mod];
    });

    fn.apply(null, mods);
};

// The layout (_layouts/website/page.html) embeds the page context as
// `<script type="application/json" id="honkit-page-context">` before this script.
// It is queued at the same position as the inline `gitbook.push(...)` of older layouts (recorded by boot.js),
// so the order of the functions pushed by plugins and inline scripts does not change.
var pageContextElement = document.querySelector("script#honkit-page-context");
if (pageContextElement) {
    var pageContext = JSON.parse(pageContextElement.textContent);
    var pageContextIndex =
        typeof window.__honkitPageContextIndex === "number" ? window.__honkitPageContextIndex : onLoad.length;
    delete window.__honkitPageContextIndex;
    onLoad.splice(pageContextIndex, 0, function () {
        page.hasChanged(pageContext);
    });
}

function onReady() {
    isPageReady = true;

    // Call pile of function once HonKit is ready
    onLoad.forEach(function (fn) {
        fn();
    });
}

/*
    Ready timing

    The scripts of the theme and plugins are loaded with `defer`: they run in order after the HTML is parsed
    and before DOMContentLoaded. jQuery's ready would fire right after this script when the document is
    already "interactive", before the following plugin scripts run. So the ready is held until
    DOMContentLoaded, which is the same timing as when the scripts were loaded synchronously.
*/
var isDocumentLoaded = document.readyState === "complete";
if (!isDocumentLoaded) {
    $.holdReady(true);
}

// Registered first, so it runs before the ready callbacks of plugins, like before
$(onReady);

// Queued `$(fn)` calls register their ready callbacks after HonKit's
bootQueue.forEach(function (call) {
    if (call.type === "ready") {
        $(call.fn);
    }
});

var released = false;
function release() {
    if (released) return;
    released = true;
    // Queued `require()` calls come from inline scripts after the plugin scripts: run them after the plugins
    bootQueue.forEach(function (call) {
        if (call.type === "require") {
            window.require(call.modules, call.fn);
        }
    });
    if (!isDocumentLoaded) {
        $.holdReady(false);
    }
}
if (document.readyState === "loading" || (document.readyState === "interactive" && !isDocumentLoaded)) {
    document.addEventListener("DOMContentLoaded", release);
    // Fallback when this script was added after DOMContentLoaded
    window.addEventListener("load", release);
} else {
    release();
}
