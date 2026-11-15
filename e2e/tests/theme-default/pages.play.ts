import { checkPage, expect, getMain, getPageHeading, test, waitForThemeReady } from "../helpers";

const PAGES = [
    { path: "book/", title: "Introduction" },
    { path: "book/chapter1/", title: "Chapter 1" },
    { path: "book/chapter1/section1.html", title: "Section 1.1" },
    { path: "book/chapter1/section2.html", title: "Section 1.2" },
    { path: "book/long.html", title: "Long Page" },
    { path: "book/chapter2/section1.html", title: "Section 2.1" },
    { path: "book/last.html", title: "Last Page" },
    { path: "multilingual/en/", title: "English Introduction" },
    { path: "multilingual/ja/", title: "日本語のはじめに" }
];

for (const { path, title } of PAGES) {
    test(`opening ${path} renders the page without errors, overflow or broken images`, async ({ page }) => {
        await page.goto(path);
        await waitForThemeReady(page);

        await expect(getPageHeading(page)).toHaveText(title);
        await checkPage(page);
    });
}

test("opening the language index lists every language of the book", async ({ page }) => {
    await page.goto("multilingual/");

    const languages = page.getByRole("navigation").getByRole("listitem");
    await expect(languages).toHaveCount(2);
    await page.getByRole("link", { name: "日本語" }).click();

    await expect(page).toHaveURL(/\/multilingual\/ja\/$/);
    await expect(getPageHeading(page)).toHaveText("日本語のはじめに");
    await checkPage(page);
});

test("clicking a glossary term opens the glossary page without errors", async ({ page }) => {
    await page.goto("book/");
    await waitForThemeReady(page);

    await page.getByRole("main").getByRole("link", { name: "HonKit", exact: true }).click();

    await expect(page).toHaveURL(/\/book\/GLOSSARY\.html(#honkit)?$/);
    await checkPage(page);
});

test("the stylesheet configured in styles.website is applied to the page", async ({ page }) => {
    await page.goto("book/");
    await waitForThemeReady(page);

    // e2e/fixtures/book/styles/website.css sets letter-spacing on the page heading.
    await expect(getPageHeading(page)).toHaveCSS("letter-spacing", "1px");
});

test("code blocks in the page are syntax highlighted", async ({ page }) => {
    await page.goto("book/");
    await waitForThemeReady(page);

    // The highlight plugin renders tokens as `<span class="hljs-*">` elements, which have no role.
    await expect(getMain(page).locator("pre code .hljs-keyword").first()).toHaveText("const");
});
