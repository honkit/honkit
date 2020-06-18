# markup-it [![Build Status](https://travis-ci.org/GitbookIO/markup-it.svg?branch=master)](https://travis-ci.org/GitbookIO/markup-it) [![NPM version](https://badge.fury.io/js/markup-it.svg)](http://badge.fury.io/js/markup-it)

`markup-it` is a JavaScript library to parse and modify markuped content (for example Markdown) using an intermediate format backed by an immutable model.


### Installation

```
$ npm i markup-it --save
```

### Usage

Initialize a syntax:

```js
var MarkupIt = require('markup-it');
var markdownSyntax = require('markup-it/syntaxes/markdown');
var htmlSyntax = require('markup-it/syntaxes/html');

var markdown = new MarkupIt(markdownSyntax);
var html = new MarkupIt(htmlSyntax);
```

#### Parse a text

```js
var content = markdown.toContent('Hello **World**');
```

#### Render content to HTML/Markdown

```js
// Render back to markdown:
var textMd = markdown.toText(content);

// Render to HTML
var textHtml = html.toText(content);
```

#### Convert HTML into Markdown

```js
var content = html.toContent('Hello <b>World</b>');
var textMd = markdown.toText(content);
```

#### Usage with ProseMirror


`markup-it` can integrates with [Prosemirror](http://prosemirror.net) for rich text editing.

Generate a doc [Node](https://prosemirror.net/guide/doc.html#nodes) using `ProseMirrorUtils.encode`:

```js
var Node = require('prosemirror/dist/model/node').Node;

var docJson = MarkupIt.ProseMirrorUtils.encode(content);

var doc = Node.fromJSON(schema, docJson);
```

And output markdown from a Doc using `ProseMirrorUtils.decode`:

```js
var docJson = pm.getDoc().toJSON();
var content = MarkupIt.ProseMirrorUtils.decode(docJson);

var text = markdown.toText(content);
```

#### Usage with Draft.js

> Coming soon!

### Extend Syntax

This module contains the [markdown syntax](./syntaxes/markdown), but you can write your custom syntax or extend the existing ones.

#### Create rules

```js
var myRule = MarkupIt.Rule(DraftMarkup.BLOCKS.HEADING_1)
    .regExp(/^<h1>(\S+)<\/h1>/, function(state, match) {
        return {
            tokens: state.parseAsInline(match[1])
        };
    })
    .toText(function(state, token) {
        return '<h1>' + state.renderAsInline(token) + '</h1>';
    });
```

#### Custom Syntax

Create a new syntax inherited from the markdown one:

```js
var mySyntax = markdownSyntax.addBlockRules(myRule);
```

Checkout the [GitBook syntax](https://github.com/GitbookIO/draft-markup/blob/master/syntaxes/gitbook/index.js) as an example of custom rules extending a syntax.
