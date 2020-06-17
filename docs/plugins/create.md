# Create and publish a plugin

A GitHon plugin is a node package published on NPM that follow a defined convention.

## Structure

#### package.json

The `package.json` is a manifest format for describing **Node.js modules**. GitHon plugins are built on top of Node modules. It declares dependencies, version, ownership, and other information required to run a plugin in GitHon. This document describes the schema in detail.

A plugin manifest `package.json` can also contain details about the required configuration. The configuration schema is defined in the `githon` field of the `package.json` (This field follow the [JSON-Schema](http://json-schema.org) guidelines):

```js
{
    "name": "githon-plugin-mytest",
    "version": "0.0.1",
    "description": "This is my first GitHon plugin",
    "engines": {
        "githon": ">1.x.x"
    },
    "githon": {
        "properties": {
            "myConfigKey": {
                "type": "string",
                "default": "it's the default value",
                "description": "It defines my awesome config!"
            }
        }
    }
}
```

You can learn more about `package.json` from the [NPM documentation](https://docs.npmjs.com/files/package.json).

The **package name** must begin with following patterns:

- `@<scope>/githon-plugin-`
- `githon-plugin-`
- `@<scope>/gitbook-plugin-`
- `gitbook-plugin-`


And the **package engines** should contains `githon` or `gitbook`.

#### index.js

The `index.js` is main entry point of your plugin runtime:

```js
module.exports = {
    // Map of hooks
    hooks: {},

    // Map of new blocks
    blocks: {},

    // Map of new filters
    filters: {}
};
```

## Publish your plugin

GitHon plugins can be published on [NPM](https://www.npmjs.com).

To publish a new plugin, you need to create an account on [npmjs.com](https://www.npmjs.com) then publish it from the command line:

```
$ npm publish
```

## Private plugins

Private plugins can be hosted on GitHub and included using `git` urls:

```
{
    "plugins": [
        "myplugin@git+https://github.com/MyCompany/mygithonplugin.git#1.0.0"
    ]
}
```
