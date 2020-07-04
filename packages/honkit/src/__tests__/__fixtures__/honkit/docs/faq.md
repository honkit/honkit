# HonKit FAQ

This page gathers common questions and answers concerning the HonKit format and toolchain.

#### How can I host/publish my book?

Publish to [GitHub Pages](https://pages.github.com/) or [Netlify](https://www.netlify.com/), and more.

#### Does not reload plugins?

HonKit use file cache per text content file by default.

This file cache check file changes and reload it automatically.
In some case, HonKit cannot detect the changes of plugins.

If you want to refresh force, please use `--reload` flag.

```
$ honkit build --reload
```

#### Does HonKit supports RTL/bi-directional text ?

The HonKit format supports right to left, and bi-directional writing. To enable it, you either need to specify a language (ex: `ar`), or force HonKit to use RTL in your `book.json`:

``` json
{
    "language": "ar",
    "direction": "rtl"
}
```

With version 3.0 of HonKit, it's automatically detected according to the content.
_Note that, while the output book will indeed respect RTL, the Editor doesn't support RTL writing yet_.

#### Should I use an `.html` or `.md` extensions in my links?

You should always use paths and the `.md` extensions when linking to your files, HonKit will automatically replace these paths by the appropriate link when the pointing file is referenced in the Table of Contents.

#### Can I create a HonKit in a sub-directory of my repository?

Yes, HonKits can be created in [sub-directories](structure.md#subdirectory). 

#### Does HonKit supports RTL languages?

Yes, HonKit automatically detect the direction in your pages (`rtl` or `ltr`) and adjust the layout accordingly. The direction can also be specified globally in the [book.json](config.md).

---

#### Does HonKit support Math equations?

HonKit supports math equations and TeX thanks to plugins. There are currently 2 official plugins to display math: [mathjax](https://plugins.honkit.com/plugin/mathjax) and [katex](https://plugins.honkit.com/plugin/katex).

#### Can I customize/theme the output?

Yes, both the website and ebook outputs can be customized using [themes](themes/README.md).

#### Can I add interactive content (videos, etc)?

HonKit is very [extensible](plugins/README.md). You can use [existing plugins](https://plugins.honkit.com) or create your own!
