import path from "path";

import TemplateEngine from "../../models/templateEngine";
import renderTemplate from "../render";
import ConrefsLoader from "../conrefsLoader";

describe("ConrefsLoader", () => {
    const dirName = `${__dirname}/`;
    const fileName = path.join(dirName, "test.md");

    describe("Git", () => {
        const engine = new TemplateEngine({
            // @ts-expect-error: Expected 0 arguments, but got 1.
            loader: new ConrefsLoader(dirName),
        });

        test("should include content from git", () => {
            jest.setTimeout(20 * 1000);

            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
            return renderTemplate(
                engine,
                fileName,
                '{% include "git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test.md" %}'
            ).then((out) => {
                expect(out.getContent()).toBe("Hello from git");
            });
        });

        test("should handle deep inclusion (1)", () => {
            jest.setTimeout(20 * 1000);

            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
            return renderTemplate(
                engine,
                fileName,
                '{% include "git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test2.md" %}'
            ).then((out) => {
                expect(out.getContent()).toBe("First Hello. Hello from git");
            });
        });

        test("should handle deep inclusion (2)", () => {
            jest.setTimeout(20 * 1000);

            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
            return renderTemplate(
                engine,
                fileName,
                '{% include "git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test3.md" %}'
            ).then((out) => {
                expect(out.getContent()).toBe("First Hello. Hello from git");
            });
        });
    });

    describe("Local", () => {
        const engine = new TemplateEngine({
            // @ts-expect-error: Expected 0 arguments, but got 1.
            loader: new ConrefsLoader(dirName),
        });

        describe("Relative", () => {
            test("should resolve basic relative filepath", () => {
                // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
                return renderTemplate(engine, fileName, '{% include "include.md" %}').then((out) => {
                    expect(out.getContent()).toBe("Hello World");
                });
            });

            test("should resolve basic parent filepath", () => {
                // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
                return renderTemplate(
                    engine,
                    path.join(dirName, "hello/test.md"),
                    '{% include "../include.md" %}'
                ).then((out) => {
                    expect(out.getContent()).toBe("Hello World");
                });
            });
        });

        describe("Absolute", () => {
            test("should resolve absolute filepath", () => {
                // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
                return renderTemplate(engine, fileName, '{% include "/include.md" %}').then((out) => {
                    expect(out.getContent()).toBe("Hello World");
                });
            });

            test("should resolve absolute filepath when in a directory", () => {
                // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
                return renderTemplate(engine, path.join(dirName, "hello/test.md"), '{% include "/include.md" %}').then(
                    (out) => {
                        expect(out.getContent()).toBe("Hello World");
                    }
                );
            });
        });
    });

    describe("transform", () => {
        function transform(filePath, source) {
            expect(typeof filePath).toBe("string");
            expect(typeof source).toBe("string");

            expect(filePath).toBe(path.resolve(__dirname, "include.md"));
            expect(source).toBe("Hello World");

            return `test-${source}-endtest`;
        }

        const engine = new TemplateEngine({
            // @ts-expect-error: Expected 0 arguments, but got 1.
            loader: new ConrefsLoader(dirName, transform),
        });

        test("should transform included content", () => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
            return renderTemplate(engine, fileName, '{% include "include.md" %}').then((out) => {
                expect(out.getContent()).toBe("test-Hello World-endtest");
            });
        });
    });
});
