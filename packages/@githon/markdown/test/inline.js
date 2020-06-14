const fs = require('fs');
const path = require('path');
const assert = require('assert');

const inline = require('../').inline;

describe('Inline', () => {
    it('should render inline markdown', () => {
        assert.equal(inline('Hello **World**').content, 'Hello <strong>World</strong>');
    });
});
