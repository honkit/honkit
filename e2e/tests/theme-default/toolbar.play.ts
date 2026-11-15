import { expect, getPageHeading, test, waitForThemeReady } from "../helpers";

type Toolbar = {
    createButton: (opts: Record<string, unknown>) => string;
    removeButton: (id: string) => void;
    removeButtons: (ids: string[]) => void;
};
type TestWindow = Window & { gitbook: { toolbar: Toolbar }; __clicks: string[] };

test.beforeEach(async ({ page }) => {
    await page.goto("book/");
    await waitForThemeReady(page);
    await page.evaluate(() => {
        (window as unknown as TestWindow).__clicks = [];
    });
});

const getHeader = (page: import("@playwright/test").Page) => {
    // `.book-header` has role="navigation" but no accessible name.
    return page.locator(".book-header");
};

test("a button created with toolbar.createButton is shown in the header and calls onClick", async ({ page }) => {
    await page.evaluate(() => {
        const w = window as unknown as TestWindow;
        w.gitbook.toolbar.createButton({
            icon: "fa fa-star",
            label: "Star this book",
            position: "right",
            onClick: (event: Event) => {
                event.preventDefault();
                w.__clicks.push("star");
            }
        });
    });

    const button = getHeader(page).getByRole("link", { name: "Star this book" });
    await expect(button).toBeVisible();
    await button.click();

    expect(await page.evaluate(() => (window as unknown as TestWindow).__clicks)).toEqual(["star"]);
});

test("a button with text shows the text", async ({ page }) => {
    await page.evaluate(() => {
        (window as unknown as TestWindow).gitbook.toolbar.createButton({ text: "Edit", label: "Edit page" });
    });

    await expect(getHeader(page).getByRole("link", { name: "Edit page" })).toHaveText("Edit");
});

test("created buttons are kept after moving to another page", async ({ page }) => {
    await page.evaluate(() => {
        (window as unknown as TestWindow).gitbook.toolbar.createButton({ icon: "fa fa-star", label: "Star this book" });
    });

    await page.getByRole("link", { name: "Next page: Chapter 1" }).click();
    await expect(getPageHeading(page)).toHaveText("Chapter 1");

    await expect(getHeader(page).getByRole("link", { name: "Star this book" })).toHaveCount(1);
});

test("toolbar.removeButton and removeButtons remove created buttons", async ({ page }) => {
    await page.evaluate(() => {
        const { toolbar } = (window as unknown as TestWindow).gitbook;
        const first = toolbar.createButton({ label: "First" });
        const second = toolbar.createButton({ label: "Second" });
        const third = toolbar.createButton({ label: "Third" });
        toolbar.removeButton(first);
        toolbar.removeButtons([second]);
        (window as unknown as { __kept: string }).__kept = third;
    });

    const header = getHeader(page);
    await expect(header.getByRole("link", { name: "First" })).toHaveCount(0);
    await expect(header.getByRole("link", { name: "Second" })).toHaveCount(0);
    await expect(header.getByRole("link", { name: "Third" })).toBeVisible();
});

test("a dropdown button opens its menu on click and closes it on a click outside", async ({ page }) => {
    await page.evaluate(() => {
        const w = window as unknown as TestWindow;
        w.gitbook.toolbar.createButton({
            icon: "fa fa-share",
            label: "Share",
            position: "right",
            dropdown: [
                [
                    { text: "Copy", onClick: () => w.__clicks.push("copy") },
                    { text: "Mail", onClick: () => w.__clicks.push("mail") }
                ],
                { text: "Print", onClick: () => w.__clicks.push("print") }
            ]
        });
    });

    const header = getHeader(page);
    const copy = header.getByRole("button", { name: "Copy" });
    await expect(copy).toBeHidden();

    await header.getByRole("link", { name: "Share" }).click();
    await expect(copy).toBeVisible();
    await expect(header.getByRole("button", { name: "Print" })).toBeVisible();

    await copy.click();
    expect(await page.evaluate(() => (window as unknown as TestWindow).__clicks)).toEqual(["copy"]);
    // Clicking inside the menu keeps it open.
    await expect(copy).toBeVisible();

    await page.getByRole("main").click();
    await expect(copy).toBeHidden();
});

test("buttons are inserted at the given index of the toolbar", async ({ page }) => {
    await page.evaluate(() => {
        const { toolbar } = (window as unknown as TestWindow).gitbook;
        toolbar.createButton({ label: "Index Zero", index: 0 });
    });

    // The order of the toolbar children is part of the createButton contract.
    const firstAction = getHeader(page).locator(":scope > .js-toolbar-action").first();
    await expect(firstAction).toHaveAttribute("aria-label", "Index Zero");
});
