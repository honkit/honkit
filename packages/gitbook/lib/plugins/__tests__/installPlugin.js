var path = require('path');

var PluginDependency = require('../../models/pluginDependency');
var Book = require('../../models/book');
var NodeFS = require('../../fs/node');
var installPlugin = require('../installPlugin');

var Parse = require('../../parse');

describe('installPlugin', () => {
    var book;

    jest.setTimeout(30000);

    beforeAll(() => {
        var fs = NodeFS(path.resolve(__dirname, '../../../../..'));
        var baseBook = Book.createForFS(fs);

        return Parse.parseConfig(baseBook)
            .then(function(_book) {
                book = _book;
            });
    });

    test('must install a plugin from NPM', () => {
        var dep = PluginDependency.createFromString('ga');
        return installPlugin(book, dep, { 'dry-run': true, 'audit': false, 'prefer-offline': true });
    });
});
