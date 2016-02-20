var _ = require('lodash');
var parseSummary = require('./summary');

// HTML -> Languages
function parseLangs(content) {
    return parseSummary(content).parts[0].articles;
}

module.exports = parseLangs;

