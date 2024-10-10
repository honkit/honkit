const pkg = require("./lerna.json");

module.exports = {
    root: "./docs",
    title: "HonKit Documentation",
    // Enforce use of HonKit v3
    gitbook: "3.1.1",
    variables: {
        version: pkg.version
    }
    // If enable new theme
    // plugins: ["-theme-default", "-search", "-lunr", "@honkit/honkit-plugin-fontsettings", "@honkit/honkit-plugin-theme"]
};
