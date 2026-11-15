import type { Page } from "@playwright/test";
import { expect, getMain, getPageHeading, getSidebarToggle, getSummary, test, waitForThemeReady } from "../helpers";

/**
 * Regression tests for reported issues of the default theme.
 * Each test links the issue with an annotation.
 */

const issue = (number: number) => {
    return { annotation: { type: "issue", description: `https://github.com/honkit/honkit/issues/${number}` } };
};

// The scrollable area of the content on desktop. It has no role, so it is located by the theme's class.
const getContentScroller = (page: Page) => page.locator(".body-inner");

test(
    "an entry without a link in the table of contents is skipped by the previous and next page links",
    issue(314),
    async ({ page }) => {
        await page.goto("book/long.html");
        await waitForThemeReady(page);

        await page.getByRole("link", { name: "Next page: Section 2.1" }).click();

        await expect(getPageHeading(page)).toHaveText("Section 2.1");
        await expect(page.getByRole("link", { name: "Previous page: Long Page" })).toBeVisible();
    }
);

test(
    "opening a page does not move the focus, so that an embedding page keeps its focus",
    issue(367),
    async ({ page }) => {
        await page.goto("book/");
        await waitForThemeReady(page);

        expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
    }
);

test("after moving to another page, the focus moves to the new content", async ({ page }) => {
    await page.goto("book/");
    await waitForThemeReady(page);

    await getSummary(page).getByRole("link", { name: "Section 1.1" }).click();

    await expect(getPageHeading(page)).toHaveText("Section 1.1");
    await expect(getMain(page)).toBeFocused();
});

test("going back to the previous page restores its scroll position", issue(339), async ({ page }) => {
    await page.goto("book/long.html");
    await waitForThemeReady(page);
    const scroller = getContentScroller(page);
    await getMain(page).hover();
    await page.mouse.wheel(0, 1500);
    await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBeGreaterThan(1000);
    const scrollTop = await scroller.evaluate((element) => element.scrollTop);

    await page.getByRole("link", { name: "Next page: Section 2.1" }).click();
    await expect(getPageHeading(page)).toHaveText("Section 2.1");
    await page.goBack();

    await expect(getPageHeading(page)).toHaveText("Long Page");
    await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBe(scrollTop);
});

test("clicking a search result of the current page shows the page content", issue(488), async ({ page }) => {
    await page.goto("book/chapter1/section1.html");
    await waitForThemeReady(page);

    await page.getByRole("search").getByRole("textbox").fill("zephyrine");
    await getMain(page).getByRole("listitem").getByRole("link", { name: "Section 1.1" }).click();

    await expect(getMain(page).getByRole("listitem")).toHaveCount(0);
    await expect(getPageHeading(page)).toHaveText("Section 1.1");
});

for (const width of [1250, 1300, 1400]) {
    test(
        `at ${width}px wide with the table of contents, the page links do not overlap the content`,
        issue(119),
        async ({ page }) => {
            await page.setViewportSize({ width, height: 800 });
            await page.goto("book/long.html");
            await waitForThemeReady(page);
            await expect(getSummary(page)).toBeInViewport();

            // `.page-inner` is the content column; it has no role.
            const content = await page.locator(".page-inner").boundingBox();
            const prev = await page.getByRole("link", { name: /^Previous page:/ }).boundingBox();
            const next = await page.getByRole("link", { name: /^Next page:/ }).boundingBox();

            expect(prev && content && prev.x + prev.width <= content.x + 0.5).toBe(true);
            expect(next && content && next.x >= content.x + content.width - 0.5).toBe(true);
        }
    );
}

test(
    "the page works with a Content-Security-Policy that blocks inline scripts and styles",
    issue(487),
    async ({ page, baseURL }) => {
        // Add the CSP header to the responses of the static server.
        await page.route(`${baseURL}**/*.html`, async (route) => {
            const response = await route.fetch();
            await route.fulfill({
                response,
                headers: { ...response.headers(), "content-security-policy": "script-src 'self'; style-src 'self'" }
            });
        });
        await page.route(`${baseURL}**/`, async (route) => {
            const response = await route.fetch();
            await route.fulfill({
                response,
                headers: { ...response.headers(), "content-security-policy": "script-src 'self'; style-src 'self'" }
            });
        });
        const violations: string[] = [];
        page.on("console", (message) => {
            if (/Content Security Policy/.test(message.text())) violations.push(message.text());
        });

        await page.goto("book/");
        await waitForThemeReady(page);
        await getSidebarToggle(page).click();
        await expect(getSummary(page)).not.toBeInViewport();
        await page.getByRole("link", { name: "Next page: Chapter 1" }).click();
        await expect(getPageHeading(page)).toHaveText("Chapter 1");

        expect(violations).toEqual([]);
    }
);

test("when the page context contains </script>, it is read as data and does not run as a script", async ({ page }) => {
    // fixtures/book/book.json has `variables.scriptProbe`, which tries to close the JSON data block
    // and run a script. It is in the page context of every page (`gitbook.state.config`).
    const expected = "</script><script>window.__honkitInjected = true;</script><!-- < ";
    type ProbeWindow = Window & {
        __honkitInjected?: boolean;
        gitbook: { state: { config: { variables: { scriptProbe: string } } } };
    };

    await page.goto("book/");
    await waitForThemeReady(page);
    expect(
        await page.evaluate(() => (window as unknown as ProbeWindow).gitbook.state.config.variables.scriptProbe)
    ).toBe(expected);

    // The context of the next page is read after navigation too
    await page.getByRole("link", { name: "Next page: Chapter 1" }).click();
    await expect(getPageHeading(page)).toHaveText("Chapter 1");
    expect(
        await page.evaluate(() => (window as unknown as ProbeWindow).gitbook.state.config.variables.scriptProbe)
    ).toBe(expected);

    expect(await page.evaluate(() => (window as unknown as ProbeWindow).__honkitInjected)).toBeUndefined();
});
