import TemplateEngine from "../templateEngine";
describe("TemplateBlock", () => {
    describe("create", () => {
        test("must initialize with a list of filters", () => {
            const engine = TemplateEngine.create({
                filters: {
                    hello: function (name) {
                        return `Hello ${name}!`;
                    },
                },
            });
            const env = engine.toNunjucks();
            const res = env.renderString('{{ "Luke"|hello }}', {});

            expect(res).toBe("Hello Luke!");
        });

        test("must initialize with a list of globals", () => {
            const engine = TemplateEngine.create({
                globals: {
                    hello: function (name) {
                        return `Hello ${name}!`;
                    },
                },
            });
            const env = engine.toNunjucks();
            const res = env.renderString('{{ hello("Luke") }}', {});

            expect(res).toBe("Hello Luke!");
        });

        test("must pass context to filters and blocks", () => {
            const engine = TemplateEngine.create({
                filters: {
                    hello: function (name) {
                        return `Hello ${name} ${this.lastName}!`;
                    },
                },
                context: {
                    lastName: "Skywalker",
                },
            });
            const env = engine.toNunjucks();
            const res = env.renderString('{{ "Luke"|hello }}', {});

            expect(res).toBe("Hello Luke Skywalker!");
        });
    });
});
