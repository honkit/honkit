function closeDropdowns() {
    document.querySelectorAll(".dropdown-menu.open").forEach(function (menu) {
        menu.classList.remove("open");
    });
}

// Bind all dropdown
function init() {
    document.addEventListener("click", function (e) {
        const target = e.target instanceof Element ? e.target : null;
        const toggle = target && target.closest(".toggle-dropdown");
        if (toggle) {
            e.preventDefault();
            const menu = toggle.parentElement && toggle.parentElement.querySelector(".dropdown-menu");
            if (menu) menu.classList.toggle("open");
            return;
        }
        // Clicking inside a menu keeps it open
        if (target && target.closest(".dropdown-menu")) {
            return;
        }
        closeDropdowns();
    });
}

module.exports = {
    init: init
};
