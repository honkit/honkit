const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert");
const path = require("node:path");

const pluginPath = path.join(__dirname, "..", "index.js");

// Load a fresh copy of the plugin, so that the module-level state does not leak between tests
function loadPlugin() {
    delete require.cache[require.resolve(pluginPath)];
    return require(pluginPath);
}

// Minimal `this` context that HonKit passes to the hooks
function createContext({ root, name = "website", config = {} }) {
    const written = {};
    const warnings = [];
    return {
        written,
        warnings,
        output: {
            name,
            root: () => root,
            toURL: (filePath) => filePath.replace(/README\.md$/, "./").replace(/\.md$/, ".html"),
            writeFile: (fileName, content) => {
                written[fileName] = JSON.parse(content);
                return Promise.resolve();
            }
        },
        config: {
            get: (key) => config[key]
        },
        log: {
            debug: { ln: () => {} },
            warn: { ln: (message) => warnings.push(message) }
        }
    };
}

function createPage(filePath, content, extra = {}) {
    return { path: filePath, title: filePath, content, ...extra };
}

async function build(plugin, context, pages) {
    plugin.hooks.init.call(context);
    for (const page of pages) {
        plugin.hooks.page.call(context, page);
    }
    await plugin.hooks.finish.call(context);
    return context.written["search_index.json"];
}

function bodies(searchIndex) {
    return Object.values(searchIndex.store).map((doc) => doc.body);
}

describe("@honkit/honkit-plugin-lunr", () => {
    let plugin;
    beforeEach(() => {
        plugin = loadPlugin();
    });

    it("writes the indexed pages to search_index.json", async () => {
        const context = createContext({ root: "/book" });
        const searchIndex = await build(plugin, context, [createPage("README.md", "<h1>Hello</h1><p>world &amp; more</p>")]);

        assert.deepStrictEqual(Object.keys(searchIndex.store), ["./"]);
        assert.strictEqual(searchIndex.store["./"].body, "Helloworld & more");
        assert.ok(searchIndex.index, "the lunr index is written");
    });

    it("keeps a separate index for each output root", async () => {
        const en = createContext({ root: "/book/en" });
        const fr = createContext({ root: "/book/fr" });
        // Hooks of both languages interleave, as in a concurrent build
        plugin.hooks.init.call(en);
        plugin.hooks.init.call(fr);
        plugin.hooks.page.call(en, createPage("README.md", "englishonly"));
        plugin.hooks.page.call(fr, createPage("README.md", "frenchonly"));
        await plugin.hooks.finish.call(en);
        await plugin.hooks.finish.call(fr);

        assert.deepStrictEqual(bodies(en.written["search_index.json"]), ["englishonly"]);
        assert.deepStrictEqual(bodies(fr.written["search_index.json"]), ["frenchonly"]);
        assert.doesNotMatch(JSON.stringify(en.written["search_index.json"].index), /frenchonly/);
        assert.doesNotMatch(JSON.stringify(fr.written["search_index.json"].index), /englishonly/);
    });

    it("starts from an empty index on each init", async () => {
        const first = createContext({ root: "/book" });
        await build(plugin, first, [createPage("old.md", "removed page")]);

        const second = createContext({ root: "/book" });
        const searchIndex = await build(plugin, second, [createPage("new.md", "current page")]);

        assert.deepStrictEqual(Object.keys(searchIndex.store), ["new.html"]);
    });

    it("applies maxIndexSize to each output root", async () => {
        const config = { "pluginsConfig.lunr.maxIndexSize": 10 };
        const big = createContext({ root: "/book/en", config });
        const small = createContext({ root: "/book/fr", config });
        plugin.hooks.init.call(big);
        plugin.hooks.init.call(small);
        plugin.hooks.page.call(big, createPage("README.md", "a text longer than ten characters"));
        plugin.hooks.page.call(small, createPage("README.md", "short"));
        await plugin.hooks.finish.call(big);
        await plugin.hooks.finish.call(small);

        assert.deepStrictEqual(bodies(big.written["search_index.json"]), []);
        assert.strictEqual(big.warnings.length, 1);
        assert.deepStrictEqual(bodies(small.written["search_index.json"]), ["short"]);
        assert.strictEqual(small.warnings.length, 0);
    });

    it("reads maxIndexSize from the legacy lunr config", async () => {
        const context = createContext({ root: "/book", config: { "lunr.maxIndexSize": 3 } });
        const searchIndex = await build(plugin, context, [createPage("README.md", "too long")]);

        assert.deepStrictEqual(bodies(searchIndex), []);
    });

    it("skips pages with search: false", async () => {
        const context = createContext({ root: "/book" });
        const searchIndex = await build(plugin, context, [
            createPage("README.md", "indexed"),
            createPage("hidden.md", "not indexed", { search: false })
        ]);

        assert.deepStrictEqual(bodies(searchIndex), ["indexed"]);
    });

    it("stores the keywords of a page", async () => {
        const context = createContext({ root: "/book" });
        const searchIndex = await build(plugin, context, [
            createPage("README.md", "body", { search: { keywords: ["alpha", "beta"] } })
        ]);

        assert.strictEqual(searchIndex.store["./"].keywords, "alpha beta");
    });

    it("does nothing for outputs other than website", async () => {
        const context = createContext({ root: "/book", name: "ebook" });
        const page = createPage("README.md", "body");

        plugin.hooks.init.call(context);
        assert.strictEqual(plugin.hooks.page.call(context, page), page);
        assert.strictEqual(plugin.hooks.finish.call(context), undefined);
        assert.deepStrictEqual(context.written, {});
    });
});
