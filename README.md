# Githon

Githon is building beautiful books using GitHub/Git and Markdown.

## Getting started

- [ ] TODO

## Usage examples

Githon can be used to create book, public documentation, enterprise manual, thesis, research papers, etc.

You can find a [list of real-world examples](docs/examples.md) in the documentation.

## Features

* Write using [Markdown](http://toolchain.gitbook.com/syntax/markdown.html) or [AsciiDoc](http://toolchain.gitbook.com/syntax/asciidoc.html)
* Output as a website or [ebook (pdf, epub, mobi)](http://toolchain.gitbook.com/ebook.html)
* [Multi-Languages](http://toolchain.gitbook.com/languages.html)
* [Lexicon / Glossary](http://toolchain.gitbook.com/lexicon.html)
* [Cover](http://toolchain.gitbook.com/ebook.html)
* [Variables and Templating](http://toolchain.gitbook.com/templating/)
* [Content References](http://toolchain.gitbook.com/templating/conrefs.html)
* [Plugins](http://toolchain.gitbook.com/plugins/)
* [Beautiful default theme](https://github.com/GitbookIO/theme-default)

## Differences with GitBook

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

Githon is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.

Githon is fork of [Githon](https://github.com/GitbookIO/gitbook).
Githon is licensed under the Apache License, Version 2.0.

Also, it includes [bignerdranch/gitbook](https://github.com/bignerdranch/gitbook) works.

## Sponsors
  
<a href="https://www.netlify.com">
<img src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg" alt="Deploys by Netlify" />
</a>
