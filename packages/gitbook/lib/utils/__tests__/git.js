var path = require('path');
var os = require('os');

var Git = require('../git');

describe('Git', () => {

    describe('URL parsing', () => {

        test('should correctly validate git urls', () => {
            // HTTPS
            expect(Git.isUrl('git+https://github.com/Hello/world.git')).toBeTruthy();

            // SSH
            expect(Git.isUrl('git+git@github.com:GitbookIO/gitbook.git/directory/README.md#e1594cde2c32e4ff48f6c4eff3d3d461743d74e1')).toBeTruthy();

            // Non valid
            expect(Git.isUrl('https://github.com/Hello/world.git')).toBeFalsy();
            expect(Git.isUrl('README.md')).toBeFalsy();
        });

        test('should parse HTTPS urls', () => {
            var parts = Git.parseUrl('git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test.md');

            expect(parts.host).toBe('https://gist.github.com/69ea4542e4c8967d2fa7.git');
            expect(parts.ref).toBe(null);
            expect(parts.filepath).toBe('test.md');
        });

        test('should parse HTTPS urls with a reference', () => {
            var parts = Git.parseUrl('git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test.md#1.0.0');

            expect(parts.host).toBe('https://gist.github.com/69ea4542e4c8967d2fa7.git');
            expect(parts.ref).toBe('1.0.0');
            expect(parts.filepath).toBe('test.md');
        });

        test('should parse SSH urls', () => {
            var parts = Git.parseUrl('git+git@github.com:GitbookIO/gitbook.git/directory/README.md#e1594cde2c32e4ff48f6c4eff3d3d461743d74e1');

            expect(parts.host).toBe('git@github.com:GitbookIO/gitbook.git');
            expect(parts.ref).toBe('e1594cde2c32e4ff48f6c4eff3d3d461743d74e1');
            expect(parts.filepath).toBe('directory/README.md');
        });
    });

    describe('Cloning and resolving', () => {
        test('should clone an HTTPS url', () => {
            var git = new Git(path.join(os.tmpdir(), 'test-git-'+Date.now()));
            return git.resolve('git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test.md')
                .then(function(filename) {
                    expect(path.extname(filename)).toBe('.md');
                });
        });
    });

});
