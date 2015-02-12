var Q = require('q');
var _ = require('lodash');

var convert = require('./utils/convert');

function parsePage(src) {
    return {
        sections: [
            {
                type: "normal",
                content: convert(src)
            }
        ]
    };
}

module.exports = parsePage;
