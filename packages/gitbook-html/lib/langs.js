var _ = require('lodash');
var parseSummary = require('./summary');

/**
    Parse an HTML content into a list of language

    @param {String} html
    @return {Array}
*/
function parseLangs(content) {
    var parts = parseSummary(content).parts;
    if (parts.length > 0) {
        return parts[0].articles;
    }

    return [];
}

module.exports = parseLangs;

