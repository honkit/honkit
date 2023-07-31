function handleNavigation(relativeUrl, push) {
    location.href = relativeUrl;
}

function goNext() {
    const url = document.querySelector(".navigation-next")?.getAttribute?.("href");
    if (url) handleNavigation(url, true);
}

function goPrev() {
    const url = document.querySelector(".navigation-prev")?.getAttribute?.("href");
    if (url) handleNavigation(url, true);
}

module.exports = {
    goNext: goNext,
    goPrev: goPrev
};
