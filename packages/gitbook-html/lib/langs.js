var _ = require('lodash');
var parseSummary = require('./summary');

// HTML -> Languages
function parseLangs(content) {
    var parts = parseSummary(content).parts;
    if (parts.length > 0) return parts[0].articles;
    return [];
}

module.exports = parseLangs;

