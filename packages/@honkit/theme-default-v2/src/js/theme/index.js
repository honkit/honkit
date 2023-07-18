import { initKeyBoard } from "./keyboard";
import { initSidebar, scrollIntoActiveSummaryItem } from "./sidebar.js";
function init() {
    initKeyBoard();
    initSidebar();
    scrollIntoActiveSummaryItem();
}

window.addEventListener("DOMContentLoaded", init, {
    passive: true
});
