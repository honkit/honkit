var $ = require("jquery");

var events = require("./events");
var storage = require("./storage");
var page = require("./page");

var isPageReady = false;
var onLoad = window.gitbook || [];

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
// It is queued at the same position as the inline `gitbook.push(...)` of older layouts,
// so the order of the functions pushed by plugins does not change.
var pageContextElement = document.querySelector("script#honkit-page-context");
if (pageContextElement) {
    var pageContext = JSON.parse(pageContextElement.textContent);
    onLoad.push(function () {
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

// Same timing as jQuery's `$(document).ready()`: after all synchronous scripts ran
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
} else {
    setTimeout(onReady);
}
