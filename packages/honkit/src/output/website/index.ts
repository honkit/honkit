import { onPage } from "./onPage";
import { onFinish } from "./onFinish";
import state from "./state";
import options from "./options";
import onInit0 from "./onInit";
import onAsset0 from "./onAsset";
import createTemplateEngine0 from "./createTemplateEngine";
export default {
    name: "website",
    State: state,
    Options: options,
    onInit: onInit0,
    onFinish: onFinish,
    onPage: onPage,
    onAsset: onAsset0,
    createTemplateEngine: createTemplateEngine0,
};
