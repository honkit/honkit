import Promise from "../../utils/promise";
import copyPluginAssets from "./copyPluginAssets";
import prepareI18n from "./prepareI18n";
import prepareResources from "./prepareResources";

/**
 Initialize the generator

 @param {Output}
 @return {Output}
 */
function onInit(output) {
    return Promise(output).then(prepareI18n).then(prepareResources).then(copyPluginAssets);
}

export default onInit;
