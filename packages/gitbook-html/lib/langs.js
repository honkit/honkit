var _ = require('lodash');
var parseSummary = require('./summary');

// HTML -> Languages
function parseLangs(content) {
    return parseSummary(content).parts[0].articles;
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
