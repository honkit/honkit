var jsonschema = require('jsonschema');
var schema = require('../configSchema');

describe('configSchema', () => {

    function validate(cfg) {
        var v = new jsonschema.Validator();
        return v.validate(cfg, schema, {
            propertyName: 'config'
        });
    }

    describe('structure', () => {

        test('should accept dot in filename', () => {
            var result = validate({
                structure: {
                    readme: 'book-intro.adoc'
                }
            });

            expect(result.errors.length).toBe(0);
        });

        test('should accept uppercase in filename', () => {
            var result = validate({
                structure: {
                    readme: 'BOOK.adoc'
                }
            });

            expect(result.errors.length).toBe(0);
        });

        test('should not accept filepath', () => {
            var result = validate({
                structure: {
                    readme: 'folder/myFile.md'
                }
            });

            expect(result.errors.length).toBe(1);
        });

    });
});
