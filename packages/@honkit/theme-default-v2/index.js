module.exports = {
    hooks: {
        config: function (config) {
            config.styles = config.styles || config.pluginsConfig["@honkit/honkit-plugin-theme-default-v2"].styles;

            return config;
        }
    }
};
