import { onFinish } from "./onFinish";
import { onPage } from "./onPage";

export default {
    name: "json",
    Options: require("./options"),
    onPage: onPage,
    onFinish: onFinish,
};
