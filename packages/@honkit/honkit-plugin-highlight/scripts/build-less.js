const fs = require("fs");
const path = require("path");

const highlightJs = require("highlight.js");

const SOLARIZED_LIGHT_CSS = readCss("base16/solarized-light.css");
const TOMORROW_CSS = readCss("base16/tomorrow.css");
const TOMORROW_NIGHT_BRIGHT_CSS = readCss("tomorrow-night-bright.css");

writeLess(
    "ebook.less",
    `
pre, code {
/* From highlight.js@${highlightJs.versionString}/styles/tomorrow.css */

${TOMORROW_CSS}
}
`
);

writeLess(
    "night.less",
    `
/* From highlight.js@${highlightJs.versionString}/styles/tomorrow-night-bright.css */

${TOMORROW_NIGHT_BRIGHT_CSS}
`
);

writeLess(
    "sepia.less",
    `
/* From highlight.js@${highlightJs.versionString}/styles/solarized-light.css */

${SOLARIZED_LIGHT_CSS}
`
);

writeLess(
    "white.less",
    `
/* From highlight.js@${highlightJs.versionString}/styles/tomorrow.css */

${TOMORROW_CSS}
`
);

function readCss(filename) {
    // We assume the directory structure of the highlight.js module like below:
    //
    //   node_modules/
    //     +-- highlight.js/
    //           +-- lib/index.js
    //           +-- styles/*.css
    //
    const STYLES_DIR = path.resolve(require.resolve("highlight.js"), "..", "..", "styles");
    return fs.readFileSync(path.join(STYLES_DIR, filename), "utf8");
}

function writeLess(filename, str) {
    const LESS_DIR = path.resolve(__dirname, "..", "less");
    fs.writeFileSync(path.join(LESS_DIR, filename), `${str.trim()}\n`, "utf8");
}
