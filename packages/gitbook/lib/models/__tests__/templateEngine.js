
describe('TemplateBlock', () => {
    var TemplateEngine = require('../templateEngine');

    describe('create', () => {
        test('must initialize with a list of filters', () => {
            var engine = TemplateEngine.create({
                filters: {
                    hello: function(name) {
                        return 'Hello ' + name + '!';
                    }
                }
            });
            var env = engine.toNunjucks();
            var res = env.renderString('{{ "Luke"|hello }}');

            expect(res).toBe('Hello Luke!');
        });

        test('must initialize with a list of globals', () => {
            var engine = TemplateEngine.create({
                globals: {
                    hello: function(name) {
                        return 'Hello ' + name + '!';
                    }
                }
            });
            var env = engine.toNunjucks();
            var res = env.renderString('{{ hello("Luke") }}');

            expect(res).toBe('Hello Luke!');
        });

        test('must pass context to filters and blocks', () => {
            var engine = TemplateEngine.create({
                filters: {
                    hello: function(name) {
                        return 'Hello ' + name + ' ' + this.lastName + '!';
                    }
                },
                context: {
                    lastName: 'Skywalker'
                }
            });
            var env = engine.toNunjucks();
            var res = env.renderString('{{ "Luke"|hello }}');

            expect(res).toBe('Hello Luke Skywalker!');
        });
    });
});