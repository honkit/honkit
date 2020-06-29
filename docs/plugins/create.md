# Create and publish a plugin

A HonKit plugin is a node package published on NPM that follow a defined convention.

## Structure

#### package.json

The `package.json` is a manifest format for describing **Node.js modules**. HonKit plugins are built on top of Node modules. It declares dependencies, version, ownership, and other information required to run a plugin in HonKit. This document describes the schema in detail.

A plugin manifest `package.json` can also contain details about the required configuration. The configuration schema is defined in the `honkit` field of the `package.json` (This field follow the [JSON-Schema](http://json-schema.org) guidelines):

```js
{
    "name": "honkit-plugin-mytest",
    "version": "0.0.1",
    "description": "This is my first HonKit plugin",
    "engines": {
        "honkit": ">1.x.x"
    },
    "honkit": {
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

- `@<scope>/honkit-plugin-`
- `honkit-plugin-`
- `@<scope>/gitbook-plugin-`
- `gitbook-plugin-`

Also, the **package engines** should contain `honkit` or `gitbook`.

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

HonKit plugins can be published on [NPM](https://www.npmjs.com).

To publish a new plugin, you need to create an account on [npmjs.com](https://www.npmjs.com) then publish it from the command line:

```
$ npm publish
```

## Private plugins

Private plugins can be hosted on GitHub and included using `git` urls:

```
{
    "plugins": [
        "myplugin@git+https://github.com/MyCompany/myhonkitplugin.git#1.0.0"
    ]
}
```
