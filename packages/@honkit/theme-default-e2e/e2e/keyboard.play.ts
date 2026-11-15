import { expect, getPageHeading, getSummary, test, waitForThemeReady } from "./fixtures";

test.beforeEach(async ({ page }) => {
    await page.goto("book/chapter1/");
    await waitForThemeReady(page);
});

test("pressing the right arrow key opens the next page", async ({ page }) => {
    await page.keyboard.press("ArrowRight");

    await expect(getPageHeading(page)).toHaveText("Section 1.1");
    await expect(page).toHaveURL(/\/book\/chapter1\/section1\.html$/);
});

test("pressing the left arrow key opens the previous page", async ({ page }) => {
    await page.keyboard.press("ArrowLeft");

    await expect(getPageHeading(page)).toHaveText("Introduction");
    await expect(page).toHaveURL(/\/book\/$/);
});

test("pressing the s key toggles the table of contents", async ({ page }) => {
    await page.keyboard.press("s");
    await expect(getSummary(page)).not.toBeInViewport();

    await page.keyboard.press("s");
    await expect(getSummary(page)).toBeInViewport();
});

test("typing in the search box does not trigger the keyboard shortcuts", async ({ page }) => {
    const searchBox = page.getByRole("search").getByRole("textbox");
    await searchBox.fill("s");
    await searchBox.press("ArrowRight");

    await expect(getSummary(page)).toBeInViewport();
    await expect(page).toHaveURL(/\/book\/chapter1\/(\?q=s)?$/);
    await expect(searchBox).toHaveValue("s");
});
