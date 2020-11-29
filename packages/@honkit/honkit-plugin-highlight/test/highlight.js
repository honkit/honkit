var tester = require('gitbook-tester');
var mocha = require('mocha');
var pluginDir = require('path').join(__dirname, '..');

describe("Detect breaking changes in highlight.js", function() {
    // Default timeout is 5000ms. That can be too low for complete
    // test (install, build, expects)
    this.timeout(20000);

    it('should highlight Haskell', function(done) {
        tester.builder()
            .withContent('``` haskell\nfibs = 0 : 1 : zipWith (+) fibs (tail fibs)\n```')
            .withLocalPlugin(pluginDir)
            .create()
            .then(function(result) {
                var expected = '<pre><code class="lang-haskell"><span class="hljs-title">fibs</span> = <span class="hljs-number">0</span> : <span class="hljs-number">1</span> : zipWith (+) fibs (tail fibs)\n</code></pre>';
                if (result.get('index.html').content !== expected) {
                    throw new Error('Found ' + result[0].content + ' instead of ' + expected);
                }
            })
            .then(done)
            .done();
    });

    it('should return a safe code block for unrecognized languages', function (done) {
        tester.builder()
            .withContent('```foo\nif (foo <= bar) { console.log(\'Too bad, foo...\'); }\n```')
            .withLocalPlugin(pluginDir)
            .create()
            .then(function(result) {
                var expected = '<pre><code class="lang-foo">if (foo &lt;= bar) { console.log(&apos;Too bad, foo...&apos;); }\n</code></pre>';
                if (result.get('index.html').content !== expected) {
                    throw new Error('Found ' + result[0].content + ' instead of ' + expected);
                }
            })
            .then(done)
            .done();
    });
});
