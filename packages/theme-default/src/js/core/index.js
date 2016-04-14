var $ = require('jquery');

var events  = require('./events');
var storage = require('./storage');
var page = require('./page');

console.log('GitBook is starting...');

// Export APIs for plugins
var gitbook = {
    events:   events,
    page:     page,

    // Deprecated
    state:    page.getState(),

    // Read/Write the localstorage
    storage: storage
};


// Modules mapping for plugins
var MODULES = {
    'gitbook': gitbook,
    'jquery':  $
};

window.gitbook = gitbook;
window.$ = $;
window.jQuery = $;
window.require = function(mods, fn) {
    mods = mods.map(function(mod) {
        mod = mod.toLowerCase();
        if (!MODULES[mod]) {
            throw new Error('GitBook module '+mod+' doesn\'t exist');
        }

        return MODULES[mod];
    });

    fn.apply(null, mods);
};

console.log('GitBook is started');
