# GitHon

GitHon is building beautiful books using GitHub/Git and Markdown.

## Getting started

- Documentation: <https://githon.netlify.app/>

## Usage examples

GitHon can be used to create book, public documentation, enterprise manual, thesis, research papers, etc.

You can find a [list of real-world examples](docs/examples.md) in the documentation.

## Features

* Write using [Markdown](https://githon.netlify.app/syntax/markdown.html) or [AsciiDoc](https://githon.netlify.app/syntax/asciidoc.html)
* Output as a website or [ebook (pdf, epub, mobi)](https://githon.netlify.app/ebook.html)
* [Multi-Languages](https://githon.netlify.app/languages.html)
* [Lexicon / Glossary](https://githon.netlify.app/lexicon.html)
* [Cover](https://githon.netlify.app/ebook.html)
* [Variables and Templating](https://githon.netlify.app/templating/)
* [Content References](https://githon.netlify.app/templating/conrefs.html)
* [Plugins](https://githon.netlify.app/plugins/)
* [Beautiful default theme](https://github.com/GitbookIO/theme-default)

## Differences with GitBook

GitHon is a fork of [GitBook (Legacy)](https://legacy.gitbook.com/).

- Node.js 14+ supports
- Improve `build`/`serve` performance
    - `githon build`: use file cache by default
    - `githon serve`: 28.2s → 0.9s in [examples/benchmark](examples/benchmark)
    - Also, support `--reload` flag for force refresh
- Remove `install` command
    - Instead of it, just use `npm install` or `yarn install` 
- Remove `global-npm` dependency
    - You can use it with another npm package manager like `yarn`

## Benchmarks

`githon build` benchmark:

- <https://azu.github.io/githon/dev/bench/>

## Licensing

GitHon is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.

GitHon is fork of [GitHon](https://github.com/GitbookIO/gitbook).
GitHon is licensed under the Apache License, Version 2.0.

Also, it includes [bignerdranch/gitbook](https://github.com/bignerdranch/gitbook) works.

## Sponsors
  
<a href="https://www.netlify.com">
<img src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg" alt="Deploys by Netlify" />
</a>
