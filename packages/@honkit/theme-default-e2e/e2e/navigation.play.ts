import { expect, getMain, getPageHeading, getSummary, getSummaryItem, test, waitForThemeReady } from "./fixtures";

type HonKitWindow = Window & {
    __navigationMarker?: string;
    gitbook: {
        state: { page: { title: string }; file: { path: string } };
    };
};

/**
 * Put a marker on `window`. The marker survives only when the theme swaps the page
 * content without a full page load.
 */
const markWindow = async (page: import("@playwright/test").Page) => {
    await page.evaluate(() => {
        (window as unknown as HonKitWindow).__navigationMarker = "kept";
    });
};
const getWindowMarker = (page: import("@playwright/test").Page) => {
    return page.evaluate(() => {
        return (window as unknown as HonKitWindow).__navigationMarker ?? null;
    });
};

test.beforeEach(async ({ page }) => {
    await page.goto("book/");
    await waitForThemeReady(page);
});

test("clicking a chapter in the table of contents shows the chapter without a full page load", async ({ page }) => {
    await markWindow(page);

    await getSummary(page).getByRole("link", { name: "Section 1.1" }).click();

    await expect(page).toHaveURL(/\/book\/chapter1\/section1\.html$/);
    await expect(getPageHeading(page)).toHaveText("Section 1.1");
    await expect(page).toHaveTitle("Section 1.1 · Theme Default Fixture");
    expect(await getWindowMarker(page)).toBe("kept");
    await expect
        .poll(() => {
            return page.evaluate(() => {
                return (window as unknown as HonKitWindow).gitbook.state.file.path;
            });
        })
        .toBe("chapter1/section1.md");
});

test("after navigating, the current chapter is highlighted in the table of contents", async ({ page }) => {
    const summary = getSummary(page);
    await summary.getByRole("link", { name: "Section 1.2" }).click();

    await expect(getPageHeading(page)).toHaveText("Section 1.2");
    await expect(getSummaryItem(page, "Section 1.2")).toHaveClass(/\bactive\b/);
    await expect(getSummaryItem(page, "Introduction")).not.toHaveClass(/\bactive\b/);
});

test("clicking the next and previous page links moves through the book in order", async ({ page }) => {
    await page.getByRole("link", { name: "Next page: Chapter 1" }).click();
    await expect(getPageHeading(page)).toHaveText("Chapter 1");
    await expect(page).toHaveURL(/\/book\/chapter1\/$/);

    await page.getByRole("link", { name: "Next page: Section 1.1" }).click();
    await expect(getPageHeading(page)).toHaveText("Section 1.1");

    await page.getByRole("link", { name: "Previous page: Chapter 1" }).click();
    await expect(getPageHeading(page)).toHaveText("Chapter 1");
});

test("the first page has only a next link and the last page has only a previous link", async ({ page }) => {
    await expect(page.getByRole("link", { name: /^Next page:/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Previous page:/ })).toHaveCount(0);

    await page.goto("book/last.html");
    await waitForThemeReady(page);
    await expect(page.getByRole("link", { name: /^Previous page:/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Next page:/ })).toHaveCount(0);
});

test("updates the prev/next <link> tags in <head> after navigation", async ({ page }) => {
    await getSummary(page).getByRole("link", { name: "Section 1.1" }).click();
    await expect(getPageHeading(page)).toHaveText("Section 1.1");

    // <link> elements in <head> have no role, so they are located by CSS.
    await expect(page.locator('head link[rel="next"]')).toHaveAttribute("href", "section2.html");
    await expect(page.locator('head link[rel="prev"]')).toHaveAttribute("href", "./");
});

test("clicking a link in the page content navigates to the linked page", async ({ page }) => {
    await markWindow(page);

    await getMain(page).getByRole("link", { name: "Go to Section 1.1" }).click();

    await expect(getPageHeading(page)).toHaveText("Section 1.1");
    expect(await getWindowMarker(page)).toBe("kept");

    await getMain(page).getByRole("link", { name: "Go to Section 1.2" }).click();
    await expect(getPageHeading(page)).toHaveText("Section 1.2");
    await expect(page).toHaveURL(/\/book\/chapter1\/section2\.html$/);
});

test("clicking a link to a heading of another page scrolls to the heading", async ({ page }) => {
    await getMain(page).getByRole("link", { name: "Go to Gamma heading of Long Page" }).click();

    await expect(getPageHeading(page)).toHaveText("Long Page");
    await expect(page).toHaveURL(/\/book\/long\.html#gamma$/);
    await expect(getMain(page).getByRole("heading", { name: "Gamma", exact: true })).toBeInViewport();
});

test("clicking a link to a heading of the same page scrolls to the heading", async ({ page }) => {
    const footer = getMain(page).getByRole("heading", { name: "Intro Footer" });
    await page.setViewportSize({ width: 1280, height: 300 });
    await expect(footer).not.toBeInViewport();

    await getMain(page).getByRole("link", { name: "Jump to intro footer" }).click();

    await expect(footer).toBeInViewport();
    await expect(page).toHaveURL(/\/book\/#intro-footer$/);
});

test("pressing the browser back button after navigating shows the previous page again", async ({ page }) => {
    await getSummary(page).getByRole("link", { name: "Section 1.1" }).click();
    await expect(getPageHeading(page)).toHaveText("Section 1.1");
    await getSummary(page).getByRole("link", { name: "Last Page" }).click();
    await expect(getPageHeading(page)).toHaveText("Last Page");

    await page.goBack();
    await expect(getPageHeading(page)).toHaveText("Section 1.1");
    await expect(page).toHaveURL(/\/book\/chapter1\/section1\.html$/);

    await page.goForward();
    await expect(getPageHeading(page)).toHaveText("Last Page");
});

test("an external link in the sidebar opens in a new window", async ({ page }) => {
    await expect(getSummary(page).getByRole("link", { name: "External Sidebar Link" })).toHaveAttribute(
        "target",
        "_blank"
    );
});

test("a chapter without a link is shown as text and its sections are reachable", async ({ page }) => {
    const summary = getSummary(page);
    await expect(summary.getByRole("listitem").filter({ hasText: "Chapter 2 without link" }).first()).toBeVisible();
    await expect(summary.getByRole("link", { name: "Chapter 2 without link" })).toHaveCount(0);

    await summary.getByRole("link", { name: "Section 2.1" }).click();
    await expect(getPageHeading(page)).toHaveText("Section 2.1");
});

test("scrolling a page whose headings are listed in the table of contents highlights the heading being read", async ({
    page
}) => {
    const summary = getSummary(page);
    await summary.getByRole("link", { name: "Long Page", exact: true }).click();
    await expect(getPageHeading(page)).toHaveText("Long Page");

    await getMain(page).hover();
    const beta = getMain(page).getByRole("heading", { name: "Beta", exact: true });
    // Scroll with the mouse wheel like a reader until the heading reaches the top of the page.
    await expect(async () => {
        await page.mouse.wheel(0, 400);
        const box = await beta.boundingBox();
        expect(box?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(200);
    }).toPass();

    await expect(getSummaryItem(page, "Long Page: Beta")).toHaveClass(/\bactive\b/);
    await expect(page).toHaveURL(/\/book\/long\.html#beta$/);
});
