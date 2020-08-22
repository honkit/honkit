import extend from "extend";
import common from "./browser";

export default extend(
    {
        initBook: require("./init"),
        createNodeFS: require("./fs/node"),
        Output: require("./output"),
        commands: require("./cli"),
    },
    common
);
