require(["gitbook"], function (gitbook) {
    /*
        Promise with the subset of the jQuery Deferred API that search plugins use.
        gitbook-plugin-search calls `gitbook.search.query(...).then(...).always(...)`,
        so the promise returned by `then` must have `always` too.
    */
    function compatPromise(promise) {
        const then = promise.then.bind(promise);
        promise.then = function (onFulfilled, onRejected) {
            return compatPromise(then(onFulfilled, onRejected));
        };
        promise.done = function (fn) {
            return promise.then(function (value) {
                fn(value);
                return value;
            });
        };
        promise.fail = function (fn) {
            return promise.then(null, function (error) {
                fn(error);
                throw error;
            });
        };
        promise.always = function (fn) {
            return promise.then(
                function (value) {
                    fn(value);
                    return value;
                },
                function (error) {
                    fn(error);
                    throw error;
                }
            );
        };
        promise.promise = function () {
            return promise;
        };
        return promise;
    }

    // Define global search engine
    function LunrSearchEngine() {
        this.index = null;
        this.store = {};
        this.name = "LunrSearchEngine";
    }

    // Initialize lunr by fetching the search index
    LunrSearchEngine.prototype.init = function () {
        const that = this;

        return compatPromise(
            fetch(gitbook.state.basePath + "/search_index.json", { credentials: "same-origin" })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error("Failed to load search_index.json: " + response.status);
                    }
                    return response.json();
                })
                .then(function (data) {
                    // lunr.min.js defines lunr as a global variable
                    that.index = window.lunr.Index.load(data.index);
                    that.store = data.store;
                })
        );
    };

    // Search for a term and return results
    LunrSearchEngine.prototype.search = function (q, offset, length) {
        const that = this;
        let results = [];

        if (this.index) {
            results = this.index.search(q).map(function (result) {
                const doc = that.store[result.ref];

                return {
                    title: doc.title,
                    url: doc.url,
                    body: doc.summary || doc.body
                };
            });
        }

        return compatPromise(
            Promise.resolve({
                query: q,
                results: results.slice(0, length),
                count: results.length
            })
        );
    };

    // Set gitbook research
    gitbook.events.bind("start", function (e, config) {
        const engine = gitbook.search.getEngine();
        if (!engine) {
            gitbook.search.setEngine(LunrSearchEngine, config);
        }
    });
});
