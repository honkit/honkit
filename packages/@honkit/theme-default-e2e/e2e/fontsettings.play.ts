import { expect, getPageHeading, test, waitForThemeReady } from "./fixtures";

test.beforeEach(async ({ page }) => {
    await page.goto("book/");
    await waitForThemeReady(page);
});

// The font settings plugin reflects its state with classes on `.book`.
const getBook = (page: import("@playwright/test").Page) => page.locator(".book");

test("choosing the night theme in the font settings changes the color theme and keeps it on the next page", async ({
    page
}) => {
    await page.getByRole("link", { name: "Font Settings" }).click();
    await page.getByRole("button", { name: "Night" }).click();

    await expect(getBook(page)).toHaveClass(/\bcolor-theme-2\b/);

    await page.getByRole("link", { name: "Next page: Chapter 1" }).click();
    await expect(getPageHeading(page)).toHaveText("Chapter 1");
    await expect(getBook(page)).toHaveClass(/\bcolor-theme-2\b/);
});

test("enlarging the font size in the font settings is kept after reloading", async ({ page }) => {
    await expect(getBook(page)).toHaveClass(/\bfont-size-2\b/);

    await page.getByRole("link", { name: "Font Settings" }).click();
    // Both font size buttons are labelled "A", so the enlarge button is located by its class.
    await page.locator("button.font-enlarge").click();
    await expect(getBook(page)).toHaveClass(/\bfont-size-3\b/);

    await page.reload();
    await waitForThemeReady(page);
    await expect(getBook(page)).toHaveClass(/\bfont-size-3\b/);
});
