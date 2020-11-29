/**
 * Edit configuration of a plugin
 * @param {Config} config
 * @param {string} plugin
 * @param {Object} pluginConfig
 * @return {Config}
 */
function editPlugin(config, pluginName, pluginConfig) {
    return config.setValue(`pluginsConfig.${pluginName}`, pluginConfig);
}

export default editPlugin;
