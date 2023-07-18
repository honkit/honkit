import { initKeyBoard } from "./keyboard";
import { scrollIntoActiveSummaryItem } from "./sidebar.js";
function init() {
    initKeyBoard();
    scrollIntoActiveSummaryItem();
}

window.addEventListener("DOMContentLoaded", init, {
    passive: true
});
