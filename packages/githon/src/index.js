import extend from "extend";

import common from "./browser";

module.exports = extend(
    {
        initBook: require("./init"),
        createNodeFS: require("./fs/node"),
        Output: require("./output"),
        commands: require("./cli"),
    },
    common
);
