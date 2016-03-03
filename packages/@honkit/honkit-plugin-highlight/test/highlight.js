var tester = require('gitbook-tester');
var mocha = require('mocha');

describe("Detect breaking changes in highlight.js", function() {
    // Default timeout is 5000ms. That can be too low for complete
    // test (install, build, expects)
    this.timeout(20000);

    it('should highlight Haskell', function(done) {
        tester.builder()
            .withContent('``` haskell\nfibs = 0 : 1 : zipWith (+) fibs (tail fibs)\n```')
            .withLocalPlugin('../') // with this version of plugin-highlight
            .create()
            .then(function(result) {
                var expected = '<h1 id="test-me">test me</h1>\n<p><img src="preview.jpg" alt="preview"></p>';
                if (result[0].content !== expected) {
                    throw new Error('Found ' + result[0].content + ' instead of ' + expected);
                }
            })
            .then(done)
            .done();
    });
});
