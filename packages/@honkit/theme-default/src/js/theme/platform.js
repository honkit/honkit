// Breakpoints are the same as `@sidebar-breakpoint` and `@mobileMaxWidth` in src/less/website/variables.less
module.exports = {
    isMobile: function () {
        return window.matchMedia("(max-width: 600px)").matches;
    },
    // Breakpoint for navigation links position
    isSmallScreen: function () {
        return window.matchMedia("(max-width: 1240px)").matches;
    }
};
