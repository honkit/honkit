# HonKit Default Theme (Legacy)

This is the default theme for HonKit.

It can be used as a template for theming books or can be extended.

![Image](./preview.png)

It is based on the GitBook theme.

## License

Apache License

Also, This theme includes GitBook default theme codes.
These are also Apache License.

- https://github.com/GitbookIO/theme-default

## Development

```sh
# Build _assets/ (JavaScript with esbuild, CSS from LESS)
pnpm --filter @honkit/honkit-plugin-theme-default run build
# Run the E2E tests of the theme
pnpm run test:e2e
```

The theme's own scripts do not depend on jQuery.
jQuery is still bundled into `gitbook.js` and exposed as `window.$`, `window.jQuery` and `require(["jquery"])`
because existing GitBook/HonKit plugins use it.
