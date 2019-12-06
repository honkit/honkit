var togglePlugin = require('../togglePlugin');
var Config = require('../../../models/config');

describe('togglePlugin', () => {
    var config = Config.createWithValues({
        plugins: ['hello', 'world', '-disabled']
    });

    test('should enable plugin', () => {
        var newConfig = togglePlugin(config, 'disabled');

        var testDep = newConfig.getPluginDependency('disabled');
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual('*');
        expect(testDep.isEnabled()).toBeTruthy();
    });

    test('should disable plugin', () => {
        var newConfig = togglePlugin(config, 'world');

        var testDep = newConfig.getPluginDependency('world');
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual('*');
        expect(testDep.isEnabled()).toBeFalsy();
    });
});


