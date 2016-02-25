
module.exports = {
    hooks: {
        config: function(config) {
            // Compatibility with GitBook v2
            config.pluginsConfig['theme-default'].styles = config.styles || config.pluginsConfig['theme-default'].styles;

            return config;
        }
    }
};


