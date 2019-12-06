var path = require('path');

var TemplateEngine = require('../../models/templateEngine');
var renderTemplate = require('../render');
var ConrefsLoader = require('../conrefsLoader');

describe('ConrefsLoader', () => {
    var dirName = __dirname + '/';
    var fileName = path.join(dirName, 'test.md');

    describe('Git', () => {
        var engine = TemplateEngine({
            loader: new ConrefsLoader(dirName)
        });

        test('should include content from git', () => {
            return renderTemplate(engine, fileName, '{% include "git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test.md" %}')
                .then(function(out) {
                    expect(out.getContent()).toBe('Hello from git');
                });
        });

        test('should handle deep inclusion (1)', () => {
            return renderTemplate(engine, fileName, '{% include "git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test2.md" %}')
                .then(function(out) {
                    expect(out.getContent()).toBe('First Hello. Hello from git');
                });
        });

        test('should handle deep inclusion (2)', () => {
            return renderTemplate(engine, fileName, '{% include "git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test3.md" %}')
                .then(function(out) {
                    expect(out.getContent()).toBe('First Hello. Hello from git');
                });
        });
    });

    describe('Local', () => {
        var engine = TemplateEngine({
            loader: new ConrefsLoader(dirName)
        });

        describe('Relative', () => {
            test('should resolve basic relative filepath', () => {
                return renderTemplate(engine, fileName, '{% include "include.md" %}')
                    .then(function(out) {
                        expect(out.getContent()).toBe('Hello World');
                    });
            });

            test('should resolve basic parent filepath', () => {
                return renderTemplate(engine, path.join(dirName, 'hello/test.md'), '{% include "../include.md" %}')
                    .then(function(out) {
                        expect(out.getContent()).toBe('Hello World');
                    });
            });
        });

        describe('Absolute', () => {
            test('should resolve absolute filepath', () => {
                return renderTemplate(engine, fileName, '{% include "/include.md" %}')
                    .then(function(out) {
                        expect(out.getContent()).toBe('Hello World');
                    });
            });

            test('should resolve absolute filepath when in a directory', () => {
                return renderTemplate(engine, path.join(dirName, 'hello/test.md'), '{% include "/include.md" %}')
                    .then(function(out) {
                        expect(out.getContent()).toBe('Hello World');
                    });
            });
        });
    });

    describe('transform', () => {
        function transform(filePath, source) {
            expect(typeof filePath).toBe('string');
            expect(typeof source).toBe('string');

            expect(filePath).toBe(path.resolve(__dirname, 'include.md'));
            expect(source).toBe('Hello World');

            return 'test-' + source + '-endtest';
        }
        var engine = TemplateEngine({
            loader: new ConrefsLoader(dirName, transform)
        });

        test('should transform included content', () => {
            return renderTemplate(engine, fileName, '{% include "include.md" %}')
                .then(function(out) {
                    expect(out.getContent()).toBe('test-Hello World-endtest');
                });
        });
    });
});

