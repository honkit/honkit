var _ = require("lodash");
var parseEntries = require("./summary").entries;


function parseLangs(content) {
    return parseEntries(content);
}

function langsToMarkdown(langs) {
    var bl = "\n";
    var content = "# Languages"+bl+bl;

    _.each(langs, function(lang) {
        content = content + "* ["+lang.title+"]("+lang.path+")"+bl;
    });

    return content;
}

module.exports = parseLangs;
module.exports.toText = langsToMarkdown;
