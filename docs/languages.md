# Multi-Languages

HonKit supports building books written in multiple languages. Each language should be a sub-directory following the normal HonKit format, and a file named `LANGS.md` should be present at the root of the repository with the following format:

```markdown
# Languages

* [English](en/)
* [French](fr/)
* [Español](es/)
```

### Configuration for each language

When a language book (ex: `en`) has a `book.json`, its configuration will extend the main configuration.

The only exception is plugins, plugins are specified globally, and language specific plugins cannot be specified.

### Plugin resources

Plugins are selected globally, but a plugin's `website` resource function runs for the root book and each language book. It can use `this.config.get("language")` to choose an `assets` directory and the CSS or JavaScript files for that language.

Declared plugin resources are copied to these paths in the generated output:

- Root book: `gitbook/<plugin-npm-id>/`
- Language book: `gitbook/<language>/<plugin-npm-id>/`

For example, `style.css` from `honkit-plugin-example` for the English book is copied to `gitbook/en/honkit-plugin-example/style.css`. Each language has its own directory, so files with the same name do not overwrite one another. Single-language books keep the root-book path.

Static theme assets from `_assets/website/` remain shared under `gitbook/` and are copied only once. External resource URLs and resources without a declared `assets` directory keep their existing paths. Themes should render the generated `plugins.resources.css` and `plugins.resources.js` entries rather than hard-code plugin resource paths.

The default theme loads a new document when a link changes the book language, including relative links between translations. This ensures that the destination language's styles and scripts are loaded. Navigation within the same language still swaps page content without a full reload.
