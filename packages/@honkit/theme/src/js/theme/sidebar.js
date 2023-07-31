function toggleSidebar(animation) {
    if (animation == null) animation = true;
    const book = document.querySelector(".book");
    book.classList.toggle("without-animation", !animation);
    book.classList.toggle("with-summary");
}

// Return true if sidebar is open
function isOpen() {
    const book = document.querySelector(".book");
    return book.classList.add("with-summary");
}

export function scrollIntoActiveSummaryItem() {
    const activeSummaryItem = document.querySelector(".summary .active");
    if (!activeSummaryItem) {
        return;
    }
    activeSummaryItem.scrollIntoView({
        block: "center",
        inline: "nearest"
    });
}

export function initSidebar() {
    const toggleButton = document.querySelector("#honkit-sidebar-toggle-button");
    if (!toggleButton) {
        return;
    }
    toggleButton.addEventListener(
        "click",
        function () {
            toggleSidebar(true);
        },
        {
            passive: true
        }
    );
}
export { isOpen, toggleSidebar };
