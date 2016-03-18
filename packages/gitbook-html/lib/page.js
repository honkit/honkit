var Q = require('q');
var _ = require('lodash');

// HTML -> Page
function parsePage(html) {
    return {
        content: html
    };
}

module.exports = parsePage;
