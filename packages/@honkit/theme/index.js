module.exports = {
    hooks: {
        config: function (config) {
            config.styles = config.styles || config.pluginsConfig["@honkit/honkit-plugin-theme"].styles;
            return config;
        }
    }
};
