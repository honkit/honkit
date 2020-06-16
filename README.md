# GitHon

GitHon is building beautiful books using GitHub/Git and Markdown.

## Documentation

- <https://githon.netlify.app/>

## Quick Start

### Installation

- Requirement: Node.js

The best way to install GitHon is via **NPM** or **Yarn**.

```
$ npm init --yes
$ npm install githon --save-dev
```

### Create a book

GitHon can set up a boilerplate book:

```
$ npx githon init
```

If you wish to create the book into a new directory, you can do so by running `githon init ./directory`

Preview and serve your book using:

```
$ npx githon serve
```

Or build the static website using:

```
$ npx githon build
```

You can start to write your book! 

For more details, see [GitHon's documentation](https://githon.netlify.app/).

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

GitHon is a fork of [GitBook (Legacy)](https://github.com/GitbookIO/gitbook).

- Node.js 14+ supports
- Improve `build`/`serve` performance
    - `githon build`: use file cache by default
    - `githon serve`: 28.2s → 0.9s in [examples/benchmark](examples/benchmark)
    - Also, support `--reload` flag for force refresh
- Improve plugin loading logic
    - Reduce cost of finding `githon-plugin-*` and `gitbook-plugin-*`
    - Support `githon-plugin-*` and `@scope/githon-plguin-*` (GitBook does not support a scoped module)
- Remove `install` command
    - Instead of it, just use `npm install` or `yarn install` 
- Remove `global-npm` dependency
    - You can use it with another npm package manager like `yarn`
- Update dependencies
    - Upgrade to nunjucks@2 etc...
    - It will reduce bug
- Monorepo codebase
    - Easy to maintain

## Migration from GitBook

Replace `gitbook-cli` with `githon`.

```
npm uninstall gitbook-cli
npm install githon --save-dev
```

Replace `gitbook` command with `githon`.

```diff
  "scripts": {
-    "build": "gitbook build",
+    "build": "githon build",
-    "serve": "gitbook serve"
+    "serve": "githon serve"
  },
```

After that, GitHon just work!

## Benchmarks

`githon build` benchmark:

- <https://azu.github.io/githon/dev/bench/>

## Licensing

GitHon is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.

GitHon is a fork of [GitBook (Legacy)](https://github.com/GitbookIO/gitbook).
GitBook is licensed under the Apache License, Version 2.0.

Also, it includes [bignerdranch/gitbook](https://github.com/bignerdranch/gitbook) works.

## Sponsors
  
<a href="https://www.netlify.com">
<img src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg" alt="Deploys by Netlify" />
</a>
