import { onPage } from "./onPage";
import { onFinish } from "./onFinish";

export default {
    name: "website",
    State: require("./state"),
    Options: require("./options"),
    onInit: require("./onInit"),
    onFinish: onFinish,
    onPage: onPage,
    onAsset: require("./onAsset"),
    createTemplateEngine: require("./createTemplateEngine"),
};
