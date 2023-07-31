function handleNavigation(relativeUrl) {
    location.href = relativeUrl;
}

export function goNext() {
    const url = document.querySelector(".navigation-next")?.getAttribute?.("href");
    if (url) handleNavigation(url);
}

export function goPrev() {
    const url = document.querySelector(".navigation-prev")?.getAttribute?.("href");
    if (url) handleNavigation(url);
}
