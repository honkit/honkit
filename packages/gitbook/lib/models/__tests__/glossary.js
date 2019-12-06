var File = require('../file');
var Glossary = require('../glossary');
var GlossaryEntry = require('../glossaryEntry');

describe('Glossary', () => {
    var glossary = Glossary.createFromEntries(File(), [
        {
            name: 'Hello World',
            description: 'Awesome!'
        },
        {
            name: 'JavaScript',
            description: 'This is a cool language'
        }
    ]);

    describe('createFromEntries', () => {
        test('must add all entries', () => {
            var entries = glossary.getEntries();
            expect(entries.size).toBe(2);
        });

        test('must add entries as GlossaryEntries', () => {
            var entries = glossary.getEntries();
            var entry = entries.get('hello-world');
            expect(entry instanceof GlossaryEntry).toBeTruthy();
        });
    });

    describe('toText', () => {
        test('return as markdown', () => {
            return glossary.toText('.md')
                .then(function(text) {
                    expect(text).toContain('# Glossary');
                });
        });
    });
});


