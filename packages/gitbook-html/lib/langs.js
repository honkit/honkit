var _ = require('lodash');
var parseEntries = require('./summary').entries;

// HTML -> Languages
function parseLangs(content) {
    return parseEntries(content);
}

// Languages -> HTML
function langsToText(langs) {
    var bl = '\n';
    var content = '<h1>Languages</h1>'+bl+bl;

    content += '<ul>' + bl;
    _.each(langs, function(lang) {
        content = content + '    <li><a href="'+lang.path+'">'+lang.title+'</a></li>'+bl;
    });
    content += '</ul>' + bl;

    return content;
}

module.exports = parseLangs;
module.exports.toText = langsToText;
