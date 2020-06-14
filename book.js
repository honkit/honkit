const pkg = require("./lerna.json");

module.exports = {
    root: "./docs",
    title: "Githon Documentation",

    // Enforce use of GitBook v3
    gitbook: "3.1.1",
    variables: {
        version: pkg.version,
    },
};
