# GitBook FAQ

This page gathers common questions and answers concerning the GitBook format and toolchain.

Questions about the legacy platform at legacy.githon.com and the Editor are gather into the [help.legacy.githon.com's FAQ](http://help.legacy.githon.com/faq.html).

#### How can I host/publish my book?

Publish to [GitHub Pages](https://pages.github.com/) or [Netlify](https://www.netlify.com/), and more.

---

#### Does GitBook supports RTL/bi-directional text ?

The GitBook format supports right to left, and bi-directional writing. To enable it, you either need to specify a language (ex: `ar`), or force GitBook to use RTL in your `book.json`:

``` json
{
    "language": "ar",
    "direction": "rtl"
}
```

With version 3.0 of GitBook, it's automatically detected according to the content.
_Note that, while the output book will indeed respect RTL, the Editor doesn't support RTL writing yet_.

#### Should I use an `.html` or `.md` extensions in my links?

You should always use paths and the `.md` extensions when linking to your files, GitBook will automatically replace these paths by the appropriate link when the pointing file is referenced in the Table of Contents.

#### Can I create a GitBook in a sub-directory of my repository?

Yes, GitBooks can be created in [sub-directories](structure.md#subdirectory). legacy.githon.com and the CLI also looks by default in a serie of [folders](structure.md).

#### Does GitBook supports RTL languages?

Yes, GitBook automatically detect the direction in your pages (`rtl` or `ltr`) and adjust the layout accordingly. The direction can also be specified globally in the [book.json](config.md).

---

#### Does GitBook support Math equations?

GitBook supports math equations and TeX thanks to plugins. There are currently 2 official plugins to display math: [mathjax](https://plugins.githon.com/plugin/mathjax) and [katex](https://plugins.githon.com/plugin/katex).

#### Can I customize/theme the output?

Yes, both the website and ebook outputs can be customized using [themes](themes/README.md).

#### Can I add interactive content (videos, etc)?

GitBook is very [extensible](plugins/README.md). You can use [existing plugins](https://plugins.githon.com) or create your own!
