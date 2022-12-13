# Testing your plugin

### Testing your plugin locally

Testing your plugin on your book before publishing it is possible using [npm link](https://docs.npmjs.com/cli/link).

In the plugin's folder, run:

```
$ npm link
```

Then in your book's folder:

```
$ npm link honkit-plugin-<plugin's name>
```

### Unit testing on Travis

[gitbook-tester](https://github.com/todvora/gitbook-tester) makes it easy to write **Node.js/Mocha** unit tests for your plugins. Using [Travis.org](https://travis.org), tests can be run on each commits/tags.

[honkit-tester](https://github.com/vowstar/honkit-tester) over time, in some cases gitbook-tester no longer works properly on the latest version of nodejs. This is a port of gitbook-tester, which could works on LTS version of nodejs v14.x v16.x v18.x, and using the honkit engine instead of gitbook to run test.
