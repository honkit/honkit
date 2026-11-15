var lunr = require("lunr");
var Entities = require("html-entities").AllHtmlEntities;

var Html = new Entities();

// HonKit generates the books of a multilingual book in the same process, concurrently,
// and reuses this module for all of them. Keep the index, its document store and its
// size budget per output root (one per language), so that one language's search_index.json
// does not contain the pages of the others. Page URLs are relative to the language root,
// so they collide between languages.
var states = {};

// Read an option from "pluginsConfig.lunr" or, for backward compatibility, from "lunr"
function getOption(context, name) {
    return context.config.get("pluginsConfig.lunr." + name) || context.config.get("lunr." + name);
}

function isWebsite(context) {
    return context.output.name === "website";
}

function createSearchIndex(ignoreSpecialCharacters) {
    return lunr(function () {
        this.ref("url");

        this.field("title", { boost: 10 });
        this.field("keywords", { boost: 15 });
        this.field("body");

        if (!ignoreSpecialCharacters) {
            // Don't trim non words characters (to allow search such as "C++")
            this.pipeline.remove(lunr.trimmer);
        }
    });
}

function createState(context) {
    return {
        searchIndex: createSearchIndex(getOption(context, "ignoreSpecialCharacters")),
        // Map of Lunr ref to document
        documentsStore: {},
        searchIndexEnabled: true,
        indexSize: 0
    };
}

// Called with the `this` context provided by HonKit
function getState(context) {
    var root = context.output.root();
    if (!states[root]) {
        states[root] = createState(context);
    }
    return states[root];
}

// Return the text of a page without HTML entities and tags
function toPlainText(content) {
    return Html.decode(content).replace(/(<([^>]+)>)/gi, "");
}

function getKeywords(page) {
    return (page.search && page.search.keywords) || [];
}

module.exports = {
    book: {
        assets: "./assets",
        js: ["lunr.min.js", "search-lunr.js"]
    },

    hooks: {
        // Start every generation of an output from an empty index ("honkit serve" rebuilds in the same process)
        init: function () {
            if (!isWebsite(this)) return;
            states[this.output.root()] = createState(this);
        },

        // Index each page
        page: function (page) {
            if (!isWebsite(this) || page.search === false) {
                return page;
            }

            var state = getState(this);
            if (!state.searchIndexEnabled) {
                return page;
            }

            this.log.debug.ln("index page", page.path);

            var text = toPlainText(page.content);
            state.indexSize += text.length;
            if (state.indexSize > getOption(this, "maxIndexSize")) {
                this.log.warn.ln("search index is too big, indexing is now disabled");
                state.searchIndexEnabled = false;
                return page;
            }

            // Add to index
            var doc = {
                url: this.output.toURL(page.path),
                title: page.title,
                summary: page.description,
                keywords: getKeywords(page).join(" "),
                body: text
            };

            state.documentsStore[doc.url] = doc;
            state.searchIndex.add(doc);

            return page;
        },

        // Write index to disk
        finish: function () {
            if (!isWebsite(this)) return;

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
