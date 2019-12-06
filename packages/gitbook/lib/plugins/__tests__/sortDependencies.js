var PluginDependency = require('../../models/pluginDependency');
var sortDependencies = require('../sortDependencies');
var toNames = require('../toNames');

describe('sortDependencies', () => {
    test('must load themes after plugins', () => {
        var allPlugins = PluginDependency.listFromArray([
            'hello',
            'theme-test',
            'world'
        ]);

        var sorted = sortDependencies(allPlugins);
        var names = toNames(sorted);

        expect(names).toEqual([
            'hello',
            'world',
            'theme-test'
        ]);
    });

    test('must keep order of themes', () => {
        var allPlugins = PluginDependency.listFromArray([
            'theme-test',
            'theme-test1',
            'hello',
            'theme-test2',
            'world'
        ]);
        var sorted = sortDependencies(allPlugins);
        var names = toNames(sorted);

        expect(names).toEqual([
            'hello',
            'world',
            'theme-test',
            'theme-test1',
            'theme-test2'
        ]);
    });
});