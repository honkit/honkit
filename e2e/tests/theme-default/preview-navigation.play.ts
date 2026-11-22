import { expect, getMain, test, waitForThemeReady } from "../helpers";

test.use({ baseURL: `http://127.0.0.1:${Number(process.env.PREVIEW_PORT ?? 4181)}/` });

// https://github.com/honkit/honkit/issues/381
// The real preview server returns X-Current-Location without the clicked fragment.
test("following a translation heading link on the preview server keeps the heading and language resources", async ({ page }) => {
    await page.goto("multilingual/en/");
    await waitForThemeReady(page);
    await expect(page.locator(".markdown-section")).toHaveCSS("--plugin-language", "en");
    await expect(page.locator("html")).toHaveAttribute("data-plugin-language", "en");

    await getMain(page).getByRole("link", { name: "Japanese installation", exact: true }).click();
    await page.waitForURL(/\/multilingual\/ja\/index\.html#installation$/, { waitUntil: "load" });
    await waitForThemeReady(page);

    await expect(page.getByRole("heading", { name: "Installation", exact: true })).toBeInViewport();
    await expect(page.locator(".markdown-section")).toHaveCSS("--plugin-language", "ja");
    await expect(page.locator("html")).toHaveAttribute("data-plugin-language", "ja");
});
