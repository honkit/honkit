var lunr = require("lunr");
var Entities = require("html-entities").AllHtmlEntities;

var Html = new Entities();

// HonKit generates the books of a multilingual book in the same process, concurrently,
// and reuses this module for all of them. Keep the index, its document store and its
// size budget per output root (one per language), so that one language's search_index.json
// does not contain the pages of the others. Page URLs are relative to the language root,
// so they collide between languages.
var states = {};

function createState(context) {
    // Create search index
    var ignoreSpecialCharacters =
        context.config.get("pluginsConfig.lunr.ignoreSpecialCharacters") ||
        context.config.get("lunr.ignoreSpecialCharacters");
    var searchIndex = lunr(function () {
        this.ref("url");

        this.field("title", { boost: 10 });
        this.field("keywords", { boost: 15 });
        this.field("body");

        if (!ignoreSpecialCharacters) {
            // Don't trim non words characters (to allow search such as "C++")
            this.pipeline.remove(lunr.trimmer);
        }
    });

    return {
        searchIndex: searchIndex,
        // Map of Lunr ref to document
        documentsStore: {},
        searchIndexEnabled: true,
        indexSize: 0
    };
}

// Called with the `this` context provided by Gitbook
function getState(context) {
    var root = context.output.root();
    if (!states[root]) {
        states[root] = createState(context);
    }
    return states[root];
}

module.exports = {
    book: {
        assets: "./assets",
        js: ["lunr.min.js", "search-lunr.js"]
    },

    hooks: {
        // Start every generation of an output from an empty index ("honkit serve" rebuilds in the same process)
        init: function () {
            if (this.output.name != "website") return;
            states[this.output.root()] = createState(this);
        },

        // Index each page
        page: function (page) {
            if (this.output.name != "website" || page.search === false) {
                return page;
            }

            var state = getState(this);
            if (!state.searchIndexEnabled) {
                return page;
            }

            var text, maxIndexSize;
            maxIndexSize = this.config.get("pluginsConfig.lunr.maxIndexSize") || this.config.get("lunr.maxIndexSize");

            this.log.debug.ln("index page", page.path);

            text = page.content;
            // Decode HTML
            text = Html.decode(text);
            // Strip HTML tags
            text = text.replace(/(<([^>]+)>)/gi, "");

            state.indexSize = state.indexSize + text.length;
            if (state.indexSize > maxIndexSize) {
                this.log.warn.ln("search index is too big, indexing is now disabled");
                state.searchIndexEnabled = false;
                return page;
            }

            var keywords = [];
            if (page.search) {
                keywords = page.search.keywords || [];
            }

            // Add to index
            var doc = {
                url: this.output.toURL(page.path),
                title: page.title,
                summary: page.description,
                keywords: keywords.join(" "),
                body: text
            };

            state.documentsStore[doc.url] = doc;
            state.searchIndex.add(doc);

            return page;
        },

        // Write index to disk
        finish: function () {
            if (this.output.name != "website") return;

            var state = getState(this);
            this.log.debug.ln("write search index");
            return this.output.writeFile(
                "search_index.json",
                JSON.stringify({
                    index: state.searchIndex,
                    store: state.documentsStore
                })
            );
        }
    }
};
