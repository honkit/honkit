import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 4180);
const isCI = Boolean(process.env.CI);

export default defineConfig({
    testDir: "./e2e",
    testMatch: "**/*.play.ts",
    fullyParallel: true,
    forbidOnly: true,
    retries: isCI ? 1 : 0,
    workers: isCI ? 2 : undefined,
    reporter: isCI ? [["list"], ["html", { open: "never" }], ["github"]] : [["list"], ["html", { open: "never" }]],
    use: {
        baseURL: `http://127.0.0.1:${port}/`,
        trace: "retain-on-failure",
        video: "retain-on-failure"
    },
    projects: [
        {
            name: "desktop",
            testIgnore: "**/*.mobile.play.ts",
            use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } }
        },
        {
            name: "mobile",
            testMatch: ["**/*.mobile.play.ts", "**/pages.play.ts"],
            use: { ...devices["Pixel 7"] }
        }
    ],
    webServer: {
        // Build the fixture books first, then serve the static output.
        command: "pnpm run test:e2e:build && pnpm run test:e2e:server",
        url: `http://127.0.0.1:${port}/book/`,
        env: { PORT: String(port) },
        reuseExistingServer: !isCI,
        timeout: 180_000
    }
});
