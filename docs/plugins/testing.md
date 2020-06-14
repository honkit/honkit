# Testing your plugin

### Testing your plugin locally

Testing your plugin on your book before publishing it is possible using [npm link](https://docs.npmjs.com/cli/link).

In the plugin's folder, run:

```
$ npm link
```

Then in your book's folder:

```
$ npm link githon-plugin-<plugin's name>
```

### Unit testing on Travis

[githon-tester](https://github.com/todvora/githon-tester) makes it easy to write **Node.js/Mocha** unit tests for your plugins. Using [Travis.org](https://travis.org), tests can be run on each commits/tags.

