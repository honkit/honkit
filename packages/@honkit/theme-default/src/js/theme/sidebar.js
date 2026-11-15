const dom = require("./dom");
const platform = require("./platform");

const gitbook = window.gitbook;

function getBook() {
    return document.querySelector(".book");
}

// Return true if sidebar is open
function isOpen() {
    const book = getBook();
    return book ? book.classList.contains("with-summary") : false;
}

// Toggle sidebar with or withour animation
function toggleSidebar(_state, animation) {
    const book = getBook();
    if (!book) return;
    if (gitbook.state != null && isOpen() == _state) return;
    if (animation == null) animation = true;
    if (_state == null) _state = !isOpen();

    book.classList.toggle("without-animation", !animation);
    book.classList.toggle("with-summary", Boolean(_state));

    gitbook.storage.set("sidebar", isOpen());
}

// Prepare sidebar: state and toggle button
function init() {
    // Note: restore last state of sidebar logic into inline JavaScript
    // See _layout/website/page.html
    // Because, It will make Layout Shift after shown DOM
    // https://web.dev/optimize-cls/

    // Close sidebar after clicking a link on mobile
    dom.delegate("click", ".book-summary li.chapter a", function () {
        if (platform.isMobile()) toggleSidebar(false, false);
    });
}

function setVisible(element, visible) {
    element.style.display = visible ? "" : "none";
}

// Filter summary with a list of path
function filterSummary(paths) {
    const summary = document.querySelector(".book-summary");
    if (!summary) return;

    summary.querySelectorAll("li").forEach(function (li) {
        const path = li.getAttribute("data-path");
        const st = paths == null || paths.indexOf(path) !== -1;

        setVisible(li, st);
        if (st) {
            let parent = li.parentElement && li.parentElement.closest("li");
            while (parent && summary.contains(parent)) {
                setVisible(parent, true);
                parent = parent.parentElement && parent.parentElement.closest("li");
            }
        }
    });
}

module.exports = {
    init: init,
    isOpen: isOpen,
    toggle: toggleSidebar,
    filter: filterSummary
};
