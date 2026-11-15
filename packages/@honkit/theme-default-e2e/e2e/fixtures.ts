import { expect, test as base, type Page } from "@playwright/test";

type PageProblems = {
    pageErrors: string[];
    consoleErrors: string[];
    failedResponses: string[];
};

/**
 * `test` used by every E2E test.
 *
 * - Requests to hosts other than the local static server are aborted,
 *   so that the result does not depend on the network.
 * - Uncaught exceptions, `console.error` and 4xx/5xx responses are collected
 *   and the test fails when any of them happened.
 */
export const test = base.extend<{ pageProblems: PageProblems }>({
    pageProblems: [
        async ({ page, baseURL }, use) => {
            const origin = new URL(baseURL ?? "http://127.0.0.1/").origin;
            const problems: PageProblems = { pageErrors: [], consoleErrors: [], failedResponses: [] };

            await page.context().route("**/*", (route) => {
                if (new URL(route.request().url()).origin === origin) {
                    return route.continue();
                }
                return route.abort("blockedbyclient");
            });
            page.on("pageerror", (error) => {
                problems.pageErrors.push(error.message);
            });
            page.on("console", (message) => {
                if (message.type() === "error") {
                    problems.consoleErrors.push(message.text());
                }
            });
            page.on("response", (response) => {
                if (response.status() >= 400) {
                    problems.failedResponses.push(`${response.status()} ${response.url()}`);
                }
            });

            await use(problems);

            expect(problems, "the page should not report errors").toEqual({
                pageErrors: [],
                consoleErrors: [],
                failedResponses: []
            });
        },
        { auto: true }
    ]
});

export { expect };

/**
 * Check the rendering of the current page without depending on its contents:
 * no horizontal overflow and no broken images.
 */
export const checkPage = async (page: Page) => {
    await expect
        .poll(
            () => {
                return page.evaluate(() => {
                    return document.documentElement.scrollWidth - document.documentElement.clientWidth;
                });
            },
            { message: "the page should not overflow horizontally" }
        )
        .toBeLessThanOrEqual(0);

    const brokenImages = await page.evaluate(() => {
        return Array.from(document.images)
            .filter((image) => {
                return image.complete && image.naturalWidth === 0;
            })
            .map((image) => {
                return image.src;
            });
    });
    expect(brokenImages, "images should be loaded").toEqual([]);
};

/**
 * Table of contents in the sidebar.
 * The `<nav>` has no accessible name, so it is scoped by the theme's container class.
 */
export const getSummary = (page: Page) => {
    return page.locator(".book-summary nav");
};

/**
 * Toolbar button that toggles the sidebar.
 * The button has no accessible name in the current markup, so it is located by
 * the icon class that the theme passes to `toolbar.createButton`.
 */
export const getSidebarToggle = (page: Page) => {
    return page.locator(".book-header a.btn:has(i.fa-align-justify)");
};

/**
 * Wait until the theme has initialized the page (`gitbook.page.hasChanged` was called).
 */
export const waitForThemeReady = async (page: Page) => {
    await page.waitForFunction(() => {
        const gitbook = (window as unknown as { gitbook?: { state?: { page?: unknown } } }).gitbook;
        return Boolean(gitbook && gitbook.state && gitbook.state.page);
    });
};

export const getMain = (page: Page) => {
    return page.getByRole("main");
};

export const getPageHeading = (page: Page) => {
    // Search result headings are hidden (not in the accessibility tree) until a search runs.
    return getMain(page).getByRole("heading", { level: 1 });
};

/**
 * List item of the table of contents that directly contains the link.
 * The theme marks the current chapter with the `active` class on this `<li>`,
 * and list items are nested, so the parent of the link is selected with XPath.
 */
export const getSummaryItem = (page: Page, linkName: string) => {
    return getSummary(page).getByRole("link", { name: linkName, exact: true }).locator("xpath=..");
};
