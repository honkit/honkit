var _ = require("lodash");
var parseEntries = require("./summary").entries;


var parseLangs = function(content) {
    return parseEntries(content);
};

module.exports = parseLangs;
