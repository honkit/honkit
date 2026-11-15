import { expect, getPageHeading, getSummary, test, waitForThemeReady } from "../helpers";

/**
 * Tests for the browser API that themes and plugins use
 * (`window.gitbook`, `window.honkit`, `window.require`, ...).
 * These APIs are public, so their behavior must be kept compatible.
 */

type Listener = (...args: unknown[]) => void;
type GitBook = {
    events: { on: (name: string, fn: Listener) => void; bind: (name: string, fn: Listener) => void };
    page: { hasChanged: Listener; getState: () => Record<string, unknown> };
    state: Record<string, unknown>;
    storage: {
        set: (key: string, value: unknown) => void;
        get: (key: string, def?: unknown) => unknown;
        remove: (key: string) => void;
    };
    push: (fn: () => void) => void;
    keyboard: { bind: (keys: string[], fn: () => void) => void };
    navigation: { goNext: () => void; goPrev: () => void };
    sidebar: {
        isOpen: () => boolean;
        toggle: (state?: boolean, animation?: boolean) => void;
        filter: (paths: string[] | null) => void;
    };
    toolbar: {
        createButton: (opts: Record<string, unknown>) => string;
        removeButton: (id: string) => void;
        removeButtons: (ids: string[]) => void;
    };
};
type TestWindow = Window & {
    gitbook: GitBook;
    honkit: GitBook;
    require: (mods: string[], fn: (...mods: unknown[]) => void) => void;
    $: unknown;
    jQuery: unknown;
    __events?: string[];
    __pushed?: string[];
};

test.beforeEach(async ({ page }) => {
    await page.goto("book/chapter1/section1.html");
    await waitForThemeReady(page);
});

test("window.gitbook and window.honkit expose the same plugin API", async ({ page }) => {
    const api = await page.evaluate(() => {
        const w = window as unknown as TestWindow;
        return {
            same: w.gitbook === w.honkit,
            keys: Object.keys(w.gitbook).sort(),
            hasJQuery: typeof w.$ === "function" && w.$ === w.jQuery
        };
    });

    expect(api.same).toBe(true);
    expect(api.keys).toEqual(
        // `search` and `fontsettings` are added by the bundled plugins.
        [
            "events",
            "fontsettings",
            "keyboard",
            "navigation",
            "page",
            "push",
            "search",
            "sidebar",
            "state",
            "storage",
            "toolbar"
        ]
    );
    expect(api.hasJQuery).toBe(true);
});

test("require() resolves the gitbook, honkit and jquery modules and rejects unknown modules", async ({ page }) => {
    const result = await page.evaluate(() => {
        const w = window as unknown as TestWindow;
        let resolved: boolean[] = [];
        w.require(["gitbook", "HonKit", "jQuery"], (gitbook, honkit, $) => {
            resolved = [gitbook === w.gitbook, honkit === w.honkit, $ === w.$];
        });
        let error = "";
        try {
            w.require(["unknown-module"], () => {});
        } catch (e) {
            error = (e as Error).message;
        }
        return { resolved, error };
    });

    expect(result.resolved).toEqual([true, true, true]);
    expect(result.error).toBe("HonKit module unknown-module doesn't exist");
});

test("gitbook.state describes the current page", async ({ page }) => {
    const state = await page.evaluate(() => {
        const s = (window as unknown as TestWindow).gitbook.state as Record<string, any>;
        return {
            pageTitle: s.page.title,
            level: s.level,
            filepath: s.filepath,
            chapterTitle: s.chapterTitle,
            basePath: s.basePath,
            root: s.root,
            bookRoot: s.bookRoot,
            innerLanguage: s.innerLanguage,
            revision: typeof s.revision,
            configTitle: s.config.title,
            hasBookElement: s.$book.length === 1 && s.$book.hasClass("book"),
            sameAsGetState: s === (window as unknown as TestWindow).gitbook.page.getState()
        };
    });

    expect(state).toEqual({
        pageTitle: "Section 1.1",
        level: "2.1.1",
        filepath: "chapter1/section1.md",
        chapterTitle: "Section 1.1",
        basePath: "..",
        root: "http://127.0.0.1:4180/book/",
        bookRoot: "http://127.0.0.1:4180/book/",
        innerLanguage: "",
        revision: "string",
        configTitle: "Theme Default Fixture",
        hasBookElement: true,
        sameAsGetState: true
    });
});

test("gitbook.state.root and bookRoot point to the language root in a multilingual book", async ({ page }) => {
    await page.goto("multilingual/ja/");
    await waitForThemeReady(page);

    const state = await page.evaluate(() => {
        const s = (window as unknown as TestWindow).gitbook.state as Record<string, any>;
        return { root: s.root, bookRoot: s.bookRoot, innerLanguage: s.innerLanguage };
    });

    expect(state).toEqual({
        root: "http://127.0.0.1:4180/multilingual/ja/",
        bookRoot: "http://127.0.0.1:4180/multilingual/",
        innerLanguage: "ja"
    });
});

test("a function passed to gitbook.push after the page is ready runs immediately", async ({ page }) => {
    const ran = await page.evaluate(() => {
        let called = false;
        (window as unknown as TestWindow).gitbook.push(() => {
            called = true;
        });
        return called;
    });

    expect(ran).toBe(true);
});

test("a function pushed to window.gitbook before the theme script loads runs once the page is ready", async ({
    page
}) => {
    await page.addInitScript(() => {
        const w = window as unknown as { gitbook: unknown[]; __pushed: string[] };
        w.__pushed = [];
        w.gitbook = [
            () => {
                w.__pushed.push("before-load");
            }
        ];
    });
    await page.reload();
    await waitForThemeReady(page);

    await expect.poll(() => page.evaluate(() => (window as unknown as TestWindow).__pushed)).toEqual(["before-load"]);
});

test("plugins receive the page.change event every time the page changes", async ({ page }) => {
    await page.evaluate(() => {
        const w = window as unknown as TestWindow;
        w.__events = [];
        w.gitbook.events.bind("page.change", () => {
            w.__events?.push(String(w.gitbook.state.filepath));
        });
    });

    await page.getByRole("link", { name: "Next page: Section 1.2" }).click();
    await expect(getPageHeading(page)).toHaveText("Section 1.2");
    await getSummary(page).getByRole("link", { name: "Last Page" }).click();
    await expect(getPageHeading(page)).toHaveText("Last Page");

    await expect
        .poll(() => page.evaluate(() => (window as unknown as TestWindow).__events))
        .toEqual(["chapter1/section2.md", "last.md"]);
});

test("plugins receive the start event once with the plugins configuration", async ({ page }) => {
    await page.addInitScript(() => {
        const w = window as unknown as { gitbook: unknown[]; __events: string[] };
        w.__events = [];
        w.gitbook = [];
        // Register the listener before the page is initialized.
        document.addEventListener("DOMContentLoaded", () => {
            const gitbook = (window as unknown as TestWindow).gitbook;
            gitbook.events.bind("start", (_event: unknown, config: unknown) => {
                w.__events.push(
                    Object.keys(config as object)
                        .sort()
                        .join(",")
                );
            });
        });
    });
    await page.reload();
    await waitForThemeReady(page);
    await page.getByRole("link", { name: "Next page: Section 1.2" }).click();
    await expect(getPageHeading(page)).toHaveText("Section 1.2");

    expect(await page.evaluate(() => (window as unknown as TestWindow).__events)).toEqual([
        "fontsettings,highlight,lunr,search,theme-default"
    ]);
});

test("gitbook.storage stores JSON values in localStorage and returns the default for missing keys", async ({
    page
}) => {
    const result = await page.evaluate(() => {
        const { storage } = (window as unknown as TestWindow).gitbook;
        storage.set("e2e-object", { a: 1 });
        const stored = storage.get("e2e-object");
        const raw = localStorage.getItem(":e2e-object");
        storage.remove("e2e-object");
        return {
            stored,
            raw,
            afterRemove: storage.get("e2e-object", "default"),
            missing: storage.get("e2e-missing", 42)
        };
    });

    expect(result).toEqual({ stored: { a: 1 }, raw: '{"a":1}', afterRemove: "default", missing: 42 });
});

test("gitbook.keyboard.bind registers a keyboard shortcut", async ({ page }) => {
    await page.evaluate(() => {
        const w = window as unknown as TestWindow;
        w.__events = [];
        w.gitbook.keyboard.bind(["k"], () => {
            w.__events?.push("k");
        });
    });

    await page.keyboard.press("k");

    await expect.poll(() => page.evaluate(() => (window as unknown as TestWindow).__events)).toEqual(["k"]);
});

test("gitbook.keyboard.bind supports modifier keys and the latest binding of a key wins", async ({ page }) => {
    await page.evaluate(() => {
        const w = window as unknown as TestWindow;
        w.__events = [];
        w.gitbook.keyboard.bind(["ctrl+k"], () => {
            w.__events?.push("first ctrl+k");
        });
        w.gitbook.keyboard.bind(["ctrl+k"], () => {
            w.__events?.push("second ctrl+k");
        });
    });

    await page.keyboard.press("k");
    await page.keyboard.press("Control+k");

    await expect.poll(() => page.evaluate(() => (window as unknown as TestWindow).__events)).toEqual(["second ctrl+k"]);
});

test("gitbook.navigation.goNext and goPrev move to the next and previous pages", async ({ page }) => {
    await page.evaluate(() => (window as unknown as TestWindow).gitbook.navigation.goNext());
    await expect(getPageHeading(page)).toHaveText("Section 1.2");

    await page.evaluate(() => (window as unknown as TestWindow).gitbook.navigation.goPrev());
    await expect(getPageHeading(page)).toHaveText("Section 1.1");
});

test("gitbook.sidebar.toggle and isOpen control the table of contents", async ({ page }) => {
    expect(await page.evaluate(() => (window as unknown as TestWindow).gitbook.sidebar.isOpen())).toBe(true);

    await page.evaluate(() => (window as unknown as TestWindow).gitbook.sidebar.toggle(false));

    await expect(getSummary(page)).not.toBeInViewport();
    expect(await page.evaluate(() => (window as unknown as TestWindow).gitbook.sidebar.isOpen())).toBe(false);
});

test("gitbook.sidebar.filter shows only the chapters of the given paths and their parents", async ({ page }) => {
    const summary = getSummary(page);
    await page.evaluate(() => (window as unknown as TestWindow).gitbook.sidebar.filter(["section2.html"]));

    await expect(summary.getByRole("link", { name: "Section 1.2" })).toBeVisible();
    await expect(summary.getByRole("link", { name: "Chapter 1", exact: true })).toBeVisible();
    await expect(summary.getByRole("link", { name: "Section 1.1" })).toBeHidden();
    await expect(summary.getByRole("link", { name: "Last Page" })).toBeHidden();

    await page.evaluate(() => (window as unknown as TestWindow).gitbook.sidebar.filter(null));
    await expect(summary.getByRole("link", { name: "Last Page" })).toBeVisible();
});

test("inline scripts placed after the theme scripts can use require(), $(fn) and gitbook.push()", async ({
    page,
    baseURL
}) => {
    // Custom themes extend the `javascript` block and add inline scripts after the theme and plugin scripts.
    await page.route(`${baseURL}book/chapter1/section1.html`, async (route) => {
        const response = await route.fetch();
        const html = (await response.text()).replace(
            "</body>",
            `<script>
                window.__calls = [];
                require(["gitbook", "jquery"], function (gitbook, $) {
                    window.__calls.push("require:" + (typeof gitbook.events.bind) + ":" + (typeof $.fn.jquery));
                    gitbook.events.bind("page.change", function () {
                        window.__calls.push("page.change");
                    });
                });
                $(function () {
                    window.__calls.push("ready:" + (typeof window.gitbook.state.page));
                });
                gitbook.push(function () {
                    window.__calls.push("push:" + window.gitbook.state.page.title);
                });
            </script></body>`
        );
        await route.fulfill({ response, body: html });
    });

    await page.goto("book/chapter1/section1.html");
    await waitForThemeReady(page);

    await expect
        .poll(() => page.evaluate(() => (window as unknown as { __calls: string[] }).__calls))
        .toEqual(["require:function:string", "page.change", "push:Section 1.1", "ready:object"]);
});
