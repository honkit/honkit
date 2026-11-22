import { expect, test, waitForThemeReady } from "../helpers";

// https://github.com/honkit/honkit/issues/417
test("HTML serialization keeps one hard break and literal references in scripts and styles", async ({ page }) => {
    await page.goto("html-serialization/");
    await waitForThemeReady(page);
    await expect(page.locator(".markdown-section > p").first().locator("br")).toHaveCount(1);
    expect(await page.evaluate(() => (window as unknown as { referenceExample: string }).referenceExample))
        .toBe("&#xA9; &#x110000;");
    expect(await page.locator(".markdown-section style").textContent()).toContain('content: "&#xA9; &#x110000;"');
});

test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    test("noscript keeps escaped key names and intentional fallback markup", async ({ page }) => {
        await page.goto("html-serialization/");
        const fallback = page.locator(".markdown-section noscript");
        await expect(fallback.locator("p")).toHaveText("Press <Enter> to continue.");
        await expect(fallback.locator("b")).toHaveText("Fallback label");
        await expect(fallback.locator("br")).toHaveCount(1);
    });
});
