import { expect, getPageHeading, getSummary, test } from "./fixtures";

test.use({ javaScriptEnabled: false });

test("without JavaScript, the page content and the table of contents are shown", async ({ page }) => {
    await page.goto("book/chapter1/section1.html");

    await expect(getPageHeading(page)).toBeVisible();
    await expect(getPageHeading(page)).toHaveText("Section 1.1");
    await expect(getSummary(page).getByRole("link", { name: "Section 1.2" })).toBeAttached();
});

test("without JavaScript, the next page link is a plain link to the next page", async ({ page }) => {
    await page.goto("book/chapter1/section1.html");

    await page.getByRole("link", { name: "Next page: Section 1.2" }).click();

    await expect(page).toHaveURL(/\/book\/chapter1\/section2\.html$/);
    await expect(getPageHeading(page)).toHaveText("Section 1.2");
});
