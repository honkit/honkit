// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Logger'.
const Logger = require("../utils/logger");

const logOptions = {
    name: "log",
    description: "Minimum log level to display",
    values: Logger.LEVELS.keySeq()
        .map((s) => {
            return s.toLowerCase();
        })
        .toJS(),
    defaults: "info",
};

const formatOption = {
    name: "format",
    description: "Format to build to",
    values: ["website", "json", "ebook"],
    defaults: "website",
};

const timingOption = {
    name: "timing",
    description: "Print timing debug information",
    defaults: false,
};

const reloadOption = {
    name: "reload",
    description: "Prune cache. Remove file cache",
    defaults: false,
};

module.exports = {
    log: logOptions,
    format: formatOption,
    timing: timingOption,
    reload: reloadOption,
};
