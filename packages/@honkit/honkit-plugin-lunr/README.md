# @honkit/honkit-plugin-lunr

`@honkit/honkit-plugin-lunr` is a fork of [GitbookIO/plugin-lunr](https://github.com/GitbookIO/plugin-lunr)@1.2.0. Unlike the original, it keeps a separate index for each language of a multilingual book.

This plugin provides a backend for the [search](https://github.com/GitbookIO/plugin-search) plugin.

This plugin is a default plugin.

### Disable this plugin

This is a default plugin and it can be disabled using a `book.json` configuration:

```js
{
    "plugins": ["-lunr"]
}
```

### Limitations

Lunr can't index a huge book, by default the index size is limited at ~100ko.

You can change this limit by settings the configuration `maxIndexSize`:

```js
{
    "pluginsConfig": {
        "lunr": {
            "maxIndexSize": 200000
        }
    }
}
```

### Adding keywords to a page

You can specify explicit keywords for any page. When searching for these keywords, the page will rank higher in the results.

```md
---
search:
    keywords: ['keyword1', 'keyword2', 'etc.']

---

# My Page

This page will rank better if we search for 'keyword1'.
```

### Disabling indexing of a page

You can disable the indexing of a specific page by adding a YAML header to the page:

```md
---
search: false
---

# My Page

This page is not indexed in Lunr.
```

### Ignoring special characters

By default, special characters will be taken into account, to allow special searches like "C++" or "#word". You can disable this if your text is essentially English prose with the `ignoreSpecialCharacters` option:


```js
{
    "pluginsConfig": {
        "lunr": {
            "ignoreSpecialCharacters": true
        }
    }
}
```
