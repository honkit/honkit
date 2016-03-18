var fs = require('fs');
var path = require('path');
var assert = require('assert');

var inline = require('../').inline;

describe('Inline', function () {
    it('should render inline AsciiDoc', function() {
        assert.equal(inline('Hello **World**').content, 'Hello <strong>World</strong>');
    });
});
