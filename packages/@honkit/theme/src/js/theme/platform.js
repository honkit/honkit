export const isMobile = function () {
    // use media query < 600px
    return window.matchMedia("(max-width: 600px)").matches;
};
// Breakpoint for navigation links position
export const isSmallScreen = function () {
    return window.matchMedia("(max-width: 1240)").matches;
};
