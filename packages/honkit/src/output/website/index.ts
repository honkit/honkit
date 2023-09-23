import { onPage } from "./onPage";
import { onFinish } from "./onFinish";
import GeneratorState from "./state";
import Options from "./options";
import onInit0 from "./onInit";
import onAsset0 from "./onAsset";
import createTemplateEngine0 from "./createTemplateEngine";

export default {
    name: "website",
    State: GeneratorState,
    Options: Options,
    onInit: onInit0,
    onFinish: onFinish,
    onPage: onPage,
    onAsset: onAsset0,
    createTemplateEngine: createTemplateEngine0
};
