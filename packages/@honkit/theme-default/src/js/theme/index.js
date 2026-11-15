const dropdown = require("./dropdown");
const keyboard = require("./keyboard");
const navigation = require("./navigation");
const sidebar = require("./sidebar");
const toolbar = require("./toolbar");

const gitbook = window.gitbook;

function init() {
    // Init sidebar
    sidebar.init();

    // Init keyboard
    keyboard.init();

    // Bind dropdown
    dropdown.init();

    // Init navigation
    navigation.init();

    // Add action to toggle sidebar
    toolbar.createButton({
        index: 0,
        icon: "fa fa-align-justify",
        onClick: function (e) {
            e.preventDefault();
            sidebar.toggle();
        },
    });
}

gitbook.events.on("start", init);

gitbook.keyboard = keyboard;
gitbook.navigation = navigation;
gitbook.sidebar = sidebar;
gitbook.toolbar = toolbar;
