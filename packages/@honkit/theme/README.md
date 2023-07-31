# HonKit Default Theme

This is new the default theme for HonKit.

It can be used as a template for theming books or can be extended.

![Image](./preview.png)

## TODO

- [ ] Support Plugin

## Difference from legacy default theme

- Drop jQuery
- Drop `window.gitbook`
- Drop font-awesome
- Drop unnecessary javascript
- Drop pjax - link is just a link
- Incompatible old plugins
- Add `window.honkit.metadata` 

```json
{
    "title": "HonKit Documentation",
    "plugins": ["-theme-default", "-search", "-lunr", "-fontsettings", "@honkit/honkit-plugin-theme"]
}
```

## License

Apache License

Also, This theme includes GitBook default theme codes.
These are also Apache License.

- https://github.com/GitbookIO/theme-default
