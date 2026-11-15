# @honkit/theme-default-e2e

End-to-end tests for [`@honkit/honkit-plugin-theme-default`](../theme-default/).

The tests build the fixture books in [`fixtures/`](./fixtures/) with `honkit build`,
serve the static output, and check the behavior in Chromium with [Playwright Test](https://playwright.dev/).
They run against the same output that users deploy, not against `honkit serve`.

## Usage

```sh
# from the repository root
pnpm install
pnpm run build
# first time only
pnpm --filter @honkit/theme-default-e2e run test:e2e:setup
# run the tests
pnpm run test:e2e
# run one file
pnpm --filter @honkit/theme-default-e2e run test:e2e e2e/navigation.play.ts
```

`test:e2e` builds the fixtures and starts the static server automatically.

## Writing tests

- Test files are `e2e/*.play.ts`. `*.mobile.play.ts` runs only in the `mobile` project (Pixel 7),
  and the other files run in the `desktop` project. `pages.play.ts` runs in both.
- Import `test` and `expect` from `e2e/fixtures.ts`. It blocks requests to other hosts and fails the test
  when the page throws, logs `console.error`, or receives a 4xx/5xx response.
- Name a test by the behavior a reader sees: "when … , … is shown".
- Locate elements by role and accessible name (`getByRole`, `getByLabel`).
  Use a CSS or XPath locator only when the markup has no role or name, and write the reason in a comment.
- Use retrying assertions (`await expect(locator).toHaveText()`) instead of reading values and comparing.
  Do not use `page.waitForTimeout`.
- When fixing a bug, first add a test that reproduces it and link the issue with
  `annotation: { type: "issue", description: "https://github.com/honkit/honkit/issues/<number>" }`.
