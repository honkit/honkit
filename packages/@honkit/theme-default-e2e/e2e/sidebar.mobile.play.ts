import { expect, getPageHeading, getSidebarToggle, getSummary, test, waitForThemeReady } from "./fixtures";

test.beforeEach(async ({ page }) => {
    await page.goto("book/");
    await waitForThemeReady(page);
});

test("on a phone, the table of contents is hidden on first visit", async ({ page }) => {
    await expect(getSummary(page)).not.toBeInViewport();
    await expect(getPageHeading(page)).toBeInViewport();
});

test("on a phone, tapping the sidebar toggle shows the table of contents", async ({ page }) => {
    await getSidebarToggle(page).click();

    await expect(getSummary(page)).toBeInViewport();
});

test("on a phone, choosing a chapter in the table of contents opens it and hides the table of contents", async ({
    page
}) => {
    await getSidebarToggle(page).click();
    await expect(getSummary(page)).toBeInViewport();

    await getSummary(page).getByRole("link", { name: "Section 1.1" }).click();

    await expect(getPageHeading(page)).toHaveText("Section 1.1");
    await expect(getSummary(page)).not.toBeInViewport();
});

test("on a phone, the next page link opens the next page", async ({ page }) => {
    await page.getByRole("link", { name: "Next page: Chapter 1" }).click();

    await expect(getPageHeading(page)).toHaveText("Chapter 1");
});
