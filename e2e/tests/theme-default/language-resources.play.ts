import { expect, test } from "../helpers";

// https://github.com/honkit/honkit/issues/381
// This book is built by the real CLI and loads the fixture plugin through Node.
// All languages declare the same filenames, but return different CSS and JS contents.
test("the CLI keeps root and language plugin files separate and links them from nested pages", async ({ request }) => {
    for (const language of ["root", "en", "ja"]) {
        const prefix = language === "root" ? "" : language + "/";
        const css = await request.get(`multilingual/gitbook/${prefix}honkit-plugin-language-resources-test/style.css`);
        expect(css.ok()).toBe(true);
        expect(await css.text()).toContain(`--plugin-language: ${language};`);
        const js = await request.get(`multilingual/gitbook/${prefix}honkit-plugin-language-resources-test/language.js`);
        expect(js.ok()).toBe(true);
        expect(await js.text()).toContain(`dataset.pluginLanguage = "${language}";`);
    }
    for (const page of ["en/index.html", "ja/index.html", "en/nested/page.html"]) {
        const response = await request.get("multilingual/" + page);
        expect(response.ok()).toBe(true);
        const html = await response.text();
        const parent = page.includes("nested/") ? "../../" : "../";
        const language = page.split("/")[0];
        expect(html).toContain(`href="${parent}gitbook/${language}/honkit-plugin-language-resources-test/style.css"`);
        expect(html).toContain(`src="${parent}gitbook/${language}/honkit-plugin-language-resources-test/language.js"`);
        expect(html).toContain(`href="${parent}gitbook/style.css"`);
    }
    expect((await request.get("multilingual/gitbook/style.css")).ok()).toBe(true);
    expect((await request.get("multilingual/en/gitbook/style.css")).status()).toBe(404);
});
