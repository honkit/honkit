import extend from "extend";
import WebsiteGenerator from "../website";

export default extend({}, WebsiteGenerator, {
    name: "ebook",
    Options: require("./options"),
    onPage: require("./onPage"),
    onFinish: require("./onFinish"),
});
