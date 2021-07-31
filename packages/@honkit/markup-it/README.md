# @honkit/markup-it

`@honkit/markup-it` is a JavaScript library to parse and modify markuped content (for example Markdown) using an intermediate format backed by an immutable model.

`@honkit/markup-it` is fork of [markup-it](https://github.com/GitbookIO/markup-it)@2.2.0

- Less dependency
- For stability

### Installation

```
$ npm i @honkit/markup-it  --save
```

### Usage

Initialize a syntax:

```js
var MarkupIt = require('@honkit/markup-it');
var markdownSyntax = require('@honkit/markup-it/syntaxes/markdown');
var htmlSyntax = require('@honkit/markup-it/syntaxes/html');

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

## License

Apache-2.0

It includes Samy Pesse and GitBook works.

- [markup-it](https://github.com/GitbookIO/markup-it)
