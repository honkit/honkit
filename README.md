# HonKit

HonKit is building beautiful books using GitHub/Git and Markdown.

![HonKit Screenshot](./honkit.png)

## Documentation and Demo

HonKit documentation is built by HonKit!

- <https://honkit.netlify.app/>

## Quick Start

### Installation

- Requirement: [Node.js](https://nodejs.org) [LTS](https://nodejs.org/about/releases/) version

The best way to install HonKit is via **NPM** or **Yarn**.

```
$ npm init --yes
$ npm install honkit --save-dev
```

⚠️ Warning:

- If you have installed `honkit` globally, you must install each plugins globally as well
- If you have installed `honkit` locally, you must install each plugins locally as well

We recommend installing `honkit` locally.

### Create a book

HonKit can set up a boilerplate book:

```
$ npx honkit init
```

If you wish to create the book into a new directory, you can do so by running `honkit init ./directory`

Preview and serve your book using:

```
$ npx honkit serve
```

Or build the static website using:

```
$ npx honkit build
```

You can start to write your book!

For more details, see [HonKit's documentation](https://honkit.netlify.app/).

## Usage examples

HonKit can be used to create a book, public documentation, enterprise manual, thesis, research papers, etc.

You can find a list of [real-world examples](https://honkit.netlify.app/examples.html) in the documentation.

## Features

* Write using [Markdown](https://honkit.netlify.app/syntax/markdown.html) or [AsciiDoc](https://honkit.netlify.app/syntax/asciidoc.html)
* Output as a website or [ebook (pdf, epub, mobi)](https://honkit.netlify.app/ebook.html)
* [Multi-Languages](https://honkit.netlify.app/languages.html)
* [Lexicon / Glossary](https://honkit.netlify.app/lexicon.html)
* [Cover](https://honkit.netlify.app/ebook.html)
* [Variables and Templating](https://honkit.netlify.app/templating/)
* [Content References](https://honkit.netlify.app/templating/conrefs.html)
* [Plugins](https://honkit.netlify.app/plugins/)
* [Beautiful default theme](./packages/@honkit/theme-default)

## Fork of GitBook

HonKit is a fork of [GitBook (Legacy)](https://github.com/GitbookIO/gitbook).
[GitBook (Legacy)](https://github.com/GitbookIO/gitbook) is [deprecated](https://github.com/GitbookIO/gitbook/commit/6c6ef7f4af32a2977e44dd23d3feb6ebf28970f4) and inactive project.

HonKit aim to smooth migration from GitBook (Legacy) to HonKit.

### Compatibility with GitBook

- Almost plugins work without changes!
- Support `gitbook-plugin-*` packages
    - You should install these plugins via npm or yarn
    - `npm install gitbook-plugin-<example> --save-dev`

### Differences with GitBook

- Node.js 14+ supports
- Improve `build`/`serve` performance
    - `honkit build`: use file cache by default
    - `honkit serve`: 28.2s → 0.9s in [examples/benchmark](examples/benchmark)
    - Also, support `--reload` flag for force refresh
- Improve plugin loading logic
    - Reduce cost of finding `honkit-plugin-*` and `gitbook-plugin-*`
    - Support `honkit-plugin-*` and `@scope/honkit-plugin-*` (GitBook does not support a scoped module)
- Remove `install` command
    - Instead of it, just use `npm install` or `yarn install`
- Remove `global-npm` dependency
    - You can use HonKit with another npm package manager like `yarn`
- Update dependencies
    - Upgrade to nunjucks@2, highlight.js etc...
    - It will reduce bug
- TypeScript
    - Rewritten by TypeScript
- Monorepo codebase
    - Easy to maintain
- Docker support

### Migration from GitBook

Replace `gitbook-cli` with `honkit`.

```
npm uninstall gitbook-cli
npm install honkit --save-dev
```

Replace `gitbook` command with `honkit` command.

```diff
  "scripts": {
-    "build": "gitbook build",
+    "build": "honkit build",
-    "serve": "gitbook serve"
+    "serve": "honkit serve"
  },
```

After that, HonKit just work!

Examples of migration:

- [Add a Github action to deploy · DjangoGirls/tutorial](https://github.com/DjangoGirls/tutorial/pull/1666)
- [Migrate from GitBook to Honkit · swaroopch/byte-of-python](https://github.com/swaroopch/byte-of-python/pull/88)
- [replace Gitbook into Honkit · yamat47/97-things-every-programmer-should-know](https://github.com/yamat47/97-things-every-programmer-should-know/pull/2)
- [Migrate misp-book from GitBook to honkit](https://github.com/MISP/misp-book/pull/227)

## Benchmarks

`honkit build` benchmark:

- <https://honkit.github.io/honkit/dev/bench/>

## Licensing

HonKit is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.

HonKit is a fork of [GitBook (Legacy)](https://github.com/GitbookIO/gitbook).
GitBook is licensed under the Apache License, Version 2.0.

Also, HonKit includes [bignerdranch/gitbook](https://github.com/bignerdranch/gitbook) works.

## Sponsors

<a href="https://www.netlify.com">
<img src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg" alt="Deploys by Netlify" />
</a>
