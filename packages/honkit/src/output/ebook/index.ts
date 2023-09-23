import extend from "extend";
import WebsiteGenerator from "../website";
import options from "./options";
import onPage0 from "./onPage";
import onFinish0 from "./onFinish";

export default extend({}, WebsiteGenerator, {
    name: "ebook",
    Options: options,
    onPage: onPage0,
    onFinish: onFinish0
});
