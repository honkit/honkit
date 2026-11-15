import { expect, getMain, getPageHeading, test, waitForThemeReady } from "./fixtures";

test.beforeEach(async ({ page }) => {
    await page.goto("book/");
    await waitForThemeReady(page);
});

test("typing a word in the search box lists the pages that contain the word", async ({ page }) => {
    await page.getByRole("search").getByRole("textbox").fill("zephyrine");

    const results = getMain(page).getByRole("listitem");
    await expect(results).toHaveCount(1);
    await expect(results.getByRole("link")).toHaveText("Section 1.1");
});

test("clicking a search result opens the page", async ({ page }) => {
    await page.getByRole("search").getByRole("textbox").fill("zephyrine");
    await getMain(page).getByRole("listitem").getByRole("link", { name: "Section 1.1" }).click();

    await expect(getPageHeading(page)).toHaveText("Section 1.1");
    await expect(page).toHaveURL(/\/book\/chapter1\/section1\.html/);
});

test("clearing the search box shows the page content again", async ({ page }) => {
    const searchBox = page.getByRole("search").getByRole("textbox");
    await searchBox.fill("zephyrine");
    await expect(getMain(page).getByRole("listitem")).toHaveCount(1);

    await searchBox.fill("");

    await expect(getPageHeading(page)).toHaveText("Introduction");
});

test("opening a page with the q query parameter runs the search", async ({ page }) => {
    await page.goto("book/?q=zephyrine");
    await waitForThemeReady(page);

    await expect(page.getByRole("search").getByRole("textbox")).toHaveValue("zephyrine");
    await expect(getMain(page).getByRole("listitem").getByRole("link")).toHaveText("Section 1.1");
});
