# @honkit/honkit-plugin-highlight

`@honkit/honkit-plugin-highlight` is a fork of [Gitbook/plugin-highlight]@2.0.3.

## Code highlighting in HonKit

This plugin is the default HonKit plugin used to highlight code blocks.

You can remove it using:

```
{
    plugins: ["-highlight"]
}
```

## TODO

Currently, tests have been disabled due to issues regarding [gitbook-tester] which is used in the tests.

Replacing [gitbook-tester] with [honkit-tester] can solve the issues, but introduces another issue...
[honkit-tester] tries to create a symbolic link called `@honkit/honkit-plugin-highlight`.
That causes an `ENOENT` error because there is no `@honkit` directory.

## License

Apache-2.0 (same as [Gitbook/plugin-highlight])

[Gitbook/plugin-highlight]: https://github.com/GitbookIO/plugin-highlight
[gitbook-tester]: https://github.com/todvora/gitbook-tester
[honkit-tester]: https://github.com/vowstar/honkit-tester
