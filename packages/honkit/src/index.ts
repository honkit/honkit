import extend from "extend";
import common from "./browser";
import init from "./init";
import fs from "./fs/node";
import output from "./output";
import cli from "./cli";

export default extend(
    {
        initBook: init,
        createNodeFS: fs,
        Output: output,
        commands: cli
    },
    common
);
