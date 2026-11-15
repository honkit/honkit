/*
    Font settings: the toolbar button to change the font size, the font family and the color theme.

    The feature is part of the theme, because its classes on `.book` change the size of the text:
    boot.js applies them before the first paint. honkit-plugin-fontsettings only enables it
    (`plugins: ["-fontsettings"]` disables it) and defines the options of `pluginsConfig.fontsettings`.
*/
const toolbar = require("./toolbar");

const gitbook = window.gitbook;

// Configuration
const MAX_SIZE = 4;
const MIN_SIZE = 0;
let BUTTON_ID;

// Current fontsettings state
let fontState;

function getBook() {
    return document.querySelector(".book");
}

// Default themes
let THEMES = [
    {
        config: "white",
        text: "White",
        id: 0
    },
    {
        config: "sepia",
        text: "Sepia",
        id: 1
    },
    {
        config: "night",
        text: "Night",
        id: 2
    }
];

// Default font families
let FAMILIES = [
    {
        config: "serif",
        text: "Serif",
        id: 0
    },
    {
        config: "sans",
        text: "Sans",
        id: 1
    }
];

// Return configured themes
function getThemes() {
    return THEMES;
}

// Modify configured themes
function setThemes(themes) {
    THEMES = themes;
    updateButtons();
}

// Return configured font families
function getFamilies() {
    return FAMILIES;
}

// Modify configured font families
function setFamilies(families) {
    FAMILIES = families;
    updateButtons();
}

// Save current font settings
function saveFontSettings() {
    gitbook.storage.set("fontState", fontState);
    update();
}

// Increase font size
function enlargeFontSize(e) {
    e.preventDefault();
    if (fontState.size >= MAX_SIZE) return;

    fontState.size++;
    saveFontSettings();
}

// Decrease font size
function reduceFontSize(e) {
    e.preventDefault();
    if (fontState.size <= MIN_SIZE) return;

    fontState.size--;
    saveFontSettings();
}

// Change font family
function changeFontFamily(configName, e) {
    if (e && e instanceof Event) {
        e.preventDefault();
    }

    const familyId = getFontFamilyId(configName);
    fontState.family = familyId;
    saveFontSettings();
}

// Change type of color theme
function changeColorTheme(configName, e) {
    if (e && e instanceof Event) {
        e.preventDefault();
    }

    const book = getBook();

    // Remove currently applied color theme
    if (fontState.theme !== 0) book.classList.remove(`color-theme-${fontState.theme}`);

    // Set new color theme
    const themeId = getThemeId(configName);
    fontState.theme = themeId;
    if (fontState.theme !== 0) book.classList.add(`color-theme-${fontState.theme}`);

    saveFontSettings();
}

// Return the correct id for a font-family config key
// Default to first font-family
function getFontFamilyId(configName) {
    // Search for plugin configured font family
    const configFamily = FAMILIES.filter((family) => {
        return family.config == configName;
    })[0];

    // Fallback to default font family
    return (configFamily && configFamily.id) || 0;
}

// Return the correct id for a theme config key
// Default to first theme
function getThemeId(configName) {
    // Search for plugin configured theme
    const configTheme = THEMES.filter((theme) => {
        return theme.config == configName;
    })[0];

    // Fallback to default theme
    return (configTheme && configTheme.id) || 0;
}

function update() {
    const book = getBook();

    document.querySelectorAll(".font-settings .font-family-list li").forEach((item) => {
        item.classList.remove("active");
    });
    document
        .querySelectorAll(`.font-settings .font-family-list li:nth-child(${fontState.family + 1})`)
        .forEach((item) => {
            item.classList.add("active");
        });

    book.className = book.className.replace(/\bfont-\S+/g, "");
    book.classList.add(`font-size-${fontState.size}`);
    book.classList.add(`font-family-${fontState.family}`);

    if (fontState.theme !== 0) {
        book.className = book.className.replace(/\bcolor-theme-\S+/g, "");
        book.classList.add(`color-theme-${fontState.theme}`);
    }
}

function initState(config) {
    // Search for plugin configured font family
    const configFamily = getFontFamilyId(config.family);
    const configTheme = getThemeId(config.theme);

    // Instantiate font state object
    fontState = gitbook.storage.get("fontState", {
        size: config.size || 2,
        family: configFamily,
        theme: configTheme
    });

    update();
}

function updateButtons() {
    // Remove existing fontsettings buttons
    if (BUTTON_ID) {
        toolbar.removeButton(BUTTON_ID);
    }

    // Create buttons in toolbar
    BUTTON_ID = toolbar.createButton({
        icon: "fa fa-font",
        label: "Font Settings",
        className: "font-settings",
        dropdown: [
            [
                {
                    text: "A",
                    className: "font-reduce",
                    onClick: reduceFontSize
                },
                {
                    text: "A",
                    className: "font-enlarge",
                    onClick: enlargeFontSize
                }
            ],
            FAMILIES.map((family) => {
                family.onClick = function (e) {
                    return changeFontFamily(family.config, e);
                };

                return family;
            }),
            THEMES.map((theme) => {
                theme.onClick = function (e) {
                    return changeColorTheme(theme.config, e);
                };

                return theme;
            })
        ]
    });
}

const api = {
    enlargeFontSize: enlargeFontSize,
    reduceFontSize: reduceFontSize,
    setTheme: changeColorTheme,
    setFamily: changeFontFamily,
    getThemes: getThemes,
    setThemes: setThemes,
    getFamilies: getFamilies,
    setFamilies: setFamilies
};

// Return true when honkit-plugin-fontsettings is enabled: its config exists only when the plugin is loaded
function isEnabled(pluginsConfig) {
    return Boolean(pluginsConfig && pluginsConfig.fontsettings);
}

/*
    Expose `gitbook.fontsettings` when the plugin is enabled.
    It is defined when theme.js is loaded, so that the scripts of other plugins can use it before "start",
    like when fontsettings.js was a script of the plugin.
*/
function expose(pluginsConfig) {
    if (isEnabled(pluginsConfig) && !gitbook.fontsettings) {
        gitbook.fontsettings = api;
    }
}

function onStart(e, config) {
    if (!isEnabled(config)) {
        return;
    }
    // For layouts without the page context element
    expose(config);
    if (gitbook.fontsettings !== api) {
        // An older honkit-plugin-fontsettings that has its own script is installed: it adds the button
        return;
    }

    // Generate buttons at start
    updateButtons();

    // Init current settings
    initState(config.fontsettings);
}

function init() {
    const pageContextElement = document.querySelector("script#honkit-page-context");
    if (pageContextElement) {
        const pageContext = JSON.parse(pageContextElement.textContent);
        expose(pageContext.config && pageContext.config.pluginsConfig);
    }

    /*
        The button is added at "start", after the buttons of the plugins.
        fontsettings.js was the last plugin script, so its "start" handler ran after the handlers of the other plugins.
        To keep the order of the toolbar buttons, the handler is bound after the plugin scripts ran:
        they are loaded with `defer` and run before DOMContentLoaded, and "start" is triggered after it.
    */
    const bindStart = function () {
        gitbook.events.bind("start", onStart);
    };
    if (document.readyState === "loading" || document.readyState === "interactive") {
        document.addEventListener("DOMContentLoaded", bindStart);
    } else {
        bindStart();
    }
}

module.exports = {
    init: init
};
