import { expect, getPageHeading, test, waitForThemeReady } from "../helpers";

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

const hasFontSettingsApi = () => {
    const gitbook = (window as unknown as { gitbook?: { fontsettings?: unknown } }).gitbook;
    return Boolean(gitbook && gitbook.fontsettings);
};

// The classes of `.book` right after the page is shown, while fontsettings.js is still held
const getClassesBeforeFontSettings = async (page: import("@playwright/test").Page) => {
    await expect(getBook(page)).not.toHaveClass(/\bhonkit-cloak\b/);
    const { classes, hasApi } = await page.evaluate(() => ({
        classes: Array.from(document.querySelector(".book")?.classList ?? []),
        hasApi: Boolean((window as unknown as { gitbook?: { fontsettings?: unknown } }).gitbook?.fontsettings)
    }));
    expect(hasApi).toBe(false);
    return classes;
};

// boot.js applies the font settings before the first paint, because fontsettings.js is loaded with `defer`
test.describe("before fontsettings.js runs", () => {
    test.beforeEach(async ({ page, baseURL }) => {
        // Hold fontsettings.js, so that the page is painted before the plugin script runs
        await page.route(`${baseURL}book/gitbook/@honkit/honkit-plugin-fontsettings/fontsettings.js`, async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await route.continue();
        });
    });

    test("the page has the font settings classes of the plugin config", async ({ page }) => {
        await page.goto("book/", { waitUntil: "commit" });
        const classes = await getClassesBeforeFontSettings(page);
        expect(classes).toEqual(expect.arrayContaining(["font-size-2", "font-family-1"]));
        expect(classes.filter((name) => name.startsWith("color-theme-"))).toEqual([]);
    });

    test("the page has the font settings classes that the reader saved", async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem(":fontState", JSON.stringify({ size: 4, family: 0, theme: 2 }));
        });
        await page.goto("book/", { waitUntil: "commit" });
        const classes = await getClassesBeforeFontSettings(page);
        expect(classes).toEqual(expect.arrayContaining(["font-size-4", "font-family-0", "color-theme-2"]));
    });

    test("the text does not move when fontsettings.js runs", async ({ page }) => {
        await page.addInitScript(() => {
            const w = window as unknown as { __layoutShift: number };
            w.__layoutShift = 0;
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
                    if (!entry.hadRecentInput) {
                        w.__layoutShift += entry.value;
                    }
                }
            }).observe({ type: "layout-shift", buffered: true });
        });
        await page.goto("book/");
        await waitForThemeReady(page);
        await page.waitForFunction(hasFontSettingsApi);
        const layoutShift = await page.evaluate(() => (window as unknown as { __layoutShift: number }).__layoutShift);
        expect(layoutShift).toBe(0);
    });
});
