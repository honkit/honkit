var generateMock = require('../testing/generateMock');
var JSONGenerator = require('../json');

describe('JSONGenerator', () => {

    test('should generate a README.json', () => {
        return generateMock(JSONGenerator, {
            'README.md': 'Hello World'
        })
            .then(function(folder) {
                expect(folder).toHaveFile('README.json');
            });
    });

    test('should generate a json file for each articles', () => {
        return generateMock(JSONGenerator, {
            'README.md': 'Hello World',
            'SUMMARY.md': '# Summary\n\n* [Page](test/page.md)',
            'test': {
                'page.md': 'Hello 2'
            }
        })
            .then(function(folder) {
                expect(folder).toHaveFile('README.json');
                expect(folder).toHaveFile('test/page.json');
            });
    });

    test('should generate a multilingual book', () => {
        return generateMock(JSONGenerator, {
            'LANGS.md': '# Languages\n\n* [en](en)\n* [fr](fr)',
            'en': {
                'README.md': 'Hello'
            },
            'fr': {
                'README.md': 'Bonjour'
            }
        })
            .then(function(folder) {
                expect(folder).toHaveFile('en/README.json');
                expect(folder).toHaveFile('fr/README.json');
                expect(folder).toHaveFile('README.json');
            });
    });
});

