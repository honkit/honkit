import { onFinish } from "./onFinish";
import { onPage } from "./onPage";

module.exports = {
    name: "json",
    Options: require("./options"),
    onPage: onPage,
    onFinish: onFinish,
};
