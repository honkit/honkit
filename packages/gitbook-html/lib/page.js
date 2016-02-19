var Q = require('q');
var _ = require('lodash');

// HTML -> HTML
function parsePage(html) {
    return {
        content: html
    };
}

module.exports = parsePage;
