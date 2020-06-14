var assert = require("assert");

global.assertObjectsEqual = function(o1, o2) {
    assert.equal(JSON.stringify(o1, null, 4), JSON.stringify(o2, null, 4));
};

