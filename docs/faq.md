# GitHon FAQ

This page gathers common questions and answers concerning the GitHon format and toolchain.

Questions about the legacy platform at legacy.githon.com and the Editor are gather into the [help.legacy.githon.com's FAQ](http://help.legacy.githon.com/faq.html).

#### How can I host/publish my book?

Publish to [GitHub Pages](https://pages.github.com/) or [Netlify](https://www.netlify.com/), and more.

#### Does not reload plugins?

GitHon use file cache per text content file by default.

This file cache check file changes and reload it automatically.
In some case, GitHon cannot detect the changes of plugins.

If you want to refresh force, please use `--reload` flag.

```
$ githon build --reload
```

#### Does GitHon supports RTL/bi-directional text ?

The GitHon format supports right to left, and bi-directional writing. To enable it, you either need to specify a language (ex: `ar`), or force GitHon to use RTL in your `book.json`:

``` json
{
    "language": "ar",
    "direction": "rtl"
}
```

With version 3.0 of GitHon, it's automatically detected according to the content.
_Note that, while the output book will indeed respect RTL, the Editor doesn't support RTL writing yet_.

#### Should I use an `.html` or `.md` extensions in my links?

You should always use paths and the `.md` extensions when linking to your files, GitHon will automatically replace these paths by the appropriate link when the pointing file is referenced in the Table of Contents.

#### Can I create a GitHon in a sub-directory of my repository?

Yes, GitHons can be created in [sub-directories](structure.md#subdirectory). legacy.githon.com and the CLI also looks by default in a serie of [folders](structure.md).

#### Does GitHon supports RTL languages?

Yes, GitHon automatically detect the direction in your pages (`rtl` or `ltr`) and adjust the layout accordingly. The direction can also be specified globally in the [book.json](config.md).

---

#### Does GitHon support Math equations?

GitHon supports math equations and TeX thanks to plugins. There are currently 2 official plugins to display math: [mathjax](https://plugins.githon.com/plugin/mathjax) and [katex](https://plugins.githon.com/plugin/katex).

#### Can I customize/theme the output?

Yes, both the website and ebook outputs can be customized using [themes](themes/README.md).

#### Can I add interactive content (videos, etc)?

GitHon is very [extensible](plugins/README.md). You can use [existing plugins](https://plugins.githon.com) or create your own!
