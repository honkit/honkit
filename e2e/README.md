# @honkit/e2e

End-to-end tests for HonKit.

The tests build the fixture books in [`fixtures/`](./fixtures/) with `honkit build` of this workspace,
serve the static output, and check it in Chromium with [Playwright Test](https://playwright.dev/).
They run against the same output that users deploy, not against `honkit serve`.

| Directory              | Target                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- |
| `tests/theme-default/` | The default theme (`@honkit/honkit-plugin-theme-default`) and its plugin API |

## Usage

```sh
# from the repository root
pnpm install
pnpm run build
# first time only
pnpm --filter @honkit/e2e run test:e2e:setup
# run the tests
pnpm run test:e2e
# run one file
pnpm --filter @honkit/e2e run test:e2e tests/theme-default/navigation.play.ts
```

`test:e2e` builds the fixtures and starts the static server automatically.

## Writing tests

- Test files are `tests/**/*.play.ts`. `*.mobile.play.ts` runs only in the `mobile` project (Pixel 7),
  and the other files run in the `desktop` project. `pages.play.ts` runs in both.
- Import `test` and `expect` from `tests/helpers.ts`. It blocks requests to other hosts and fails the test
  when the page throws, logs `console.error`, or receives a 4xx/5xx response.
- Name a test by the behavior a reader sees: "when … , … is shown".
- Locate elements by role and accessible name (`getByRole`, `getByLabel`).
  Use a CSS or XPath locator only when the markup has no role or name, and write the reason in a comment.
- Use retrying assertions (`await expect(locator).toHaveText()`) instead of reading values and comparing.
  Do not use `page.waitForTimeout`.
- When fixing a bug, first add a test that reproduces it and link the issue with
  `annotation: { type: "issue", description: "https://github.com/honkit/honkit/issues/<number>" }`.

## Multilingual resource regression

`plugins/honkit-plugin-language-resources-test` is a real plugin loaded by the CLI through Node's `NODE_PATH` during fixture builds. Its `website` function selects a language directory. Each directory has the same `style.css` and `language.js` names but different contents.

The resource test checks the generated root and language files, nested-page links and the shared theme stylesheet. The navigation test follows a Markdown translation link and checks the destination plugin's computed CSS and JavaScript-set language attribute. It does not inject links or replace the plugin resolver.

The preview navigation test uses HonKit's own server implementation on port 4181 (`PREVIEW_PORT` overrides it). This checks heading fragments with the real `X-Current-Location` header instead of intercepting responses.
