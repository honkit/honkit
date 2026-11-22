module.exports = {
    website: function () {
        var language = this.config.get("language") || "root";
        return { assets: "assets/" + language, css: ["style.css"], js: ["language.js"] };
    }
};
