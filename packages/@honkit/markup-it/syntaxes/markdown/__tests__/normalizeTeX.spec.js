const { normalizeTeX } = require("../math.js");

describe("normalizeTeX", () => {
    it(`should normalize`, () => {
        expect(normalizeTeX("$a$", true)).toMatchInlineSnapshot(`"$a$"`);
        expect(normalizeTeX("$$a$$", true)).toMatchInlineSnapshot(`"$$a$$"`);
        expect(normalizeTeX("$a$ $b$", true)).toMatchInlineSnapshot(`"$a$ $b$"`);
        expect(normalizeTeX("$a$ $b$ $c$", true)).toMatchInlineSnapshot(`"$a$ $b$ $c$"`);
        expect(normalizeTeX("$a$\n$b$", true)).toMatchInlineSnapshot(`
            "$a$
            $b$"
        `);
        expect(normalizeTeX("$a$\n\n$b$", true)).toMatchInlineSnapshot(`
            "$a$

            $b$"
        `);
        expect(normalizeTeX("$a$ $b$\n", true)).toMatchInlineSnapshot(`"$a$ $b$"`);
        expect(normalizeTeX("$a$ $b$\n\n", true)).toMatchInlineSnapshot(`"$a$ $b$"`);
        expect(normalizeTeX("$a$\n$b$\n", true)).toMatchInlineSnapshot(`
            "$a$
            $b$"
        `);
        expect(normalizeTeX("$a$\n\n$b$\n\n", true)).toMatchInlineSnapshot(`
            "$a$

            $b$"
        `);
        expect(normalizeTeX("$a$ $b$", true)).toMatchInlineSnapshot(`"$a$ $b$"`);
        expect(normalizeTeX("$a$  $b$", true)).toMatchInlineSnapshot(`"$a$  $b$"`);
        expect(normalizeTeX("$a$ $b$ $c$", true)).toMatchInlineSnapshot(`"$a$ $b$ $c$"`);
        expect(normalizeTeX("$a$  $b$  $c$", true)).toMatchInlineSnapshot(`"$a$  $b$  $c$"`);
    });
});
