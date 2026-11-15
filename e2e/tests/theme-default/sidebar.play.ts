import { expect, getPageHeading, getSidebarToggle, getSummary, test, waitForThemeReady } from "../helpers";

test.beforeEach(async ({ page }) => {
    await page.goto("book/");
    await waitForThemeReady(page);
});

test("on first visit, the table of contents is shown next to the page", async ({ page }) => {
    await expect(getSummary(page)).toBeInViewport();
});

test("clicking the sidebar toggle hides and shows the table of contents", async ({ page }) => {
    const summary = getSummary(page);

    await getSidebarToggle(page).click();
    await expect(summary).not.toBeInViewport();

    await getSidebarToggle(page).click();
    await expect(summary).toBeInViewport();
});

test("the hidden state of the table of contents is kept after reloading the page", async ({ page }) => {
    await getSidebarToggle(page).click();
    await expect(getSummary(page)).not.toBeInViewport();

    await page.reload();
    await waitForThemeReady(page);

    await expect(getSummary(page)).not.toBeInViewport();
});

test("the hidden state of the table of contents is kept after moving to another page", async ({ page }) => {
    await getSidebarToggle(page).click();
    await expect(getSummary(page)).not.toBeInViewport();

    await page.getByRole("link", { name: "Next page: Chapter 1" }).click();

    await expect(getPageHeading(page)).toHaveText("Chapter 1");
    await expect(getSummary(page)).not.toBeInViewport();
});

test("the scroll position of the table of contents is kept after moving to another page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 300 });
    // The scrollable container of the sidebar has no role, so it is located by the theme's class.
    const scroller = page.locator(".book-summary");
    const link = getSummary(page).getByRole("link", { name: "Last Page" });
    await link.scrollIntoViewIfNeeded();
    const scrollTop = await scroller.evaluate((element) => element.scrollTop);
    expect(scrollTop).toBeGreaterThan(0);

    await link.click();

    await expect(getPageHeading(page)).toHaveText("Last Page");
    await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBe(scrollTop);
});
