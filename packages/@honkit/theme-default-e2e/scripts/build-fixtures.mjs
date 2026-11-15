// Build every fixture book with the HonKit CLI of this workspace.
// The output is the same static site that `honkit build` produces for users,
// so the tests run against the production output instead of `honkit serve`.
import { execFileSync } from "node:child_process";
import { readdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = path.join(packageDir, "fixtures");
const outputDir = path.join(packageDir, "dist");
const honkitBin = path.join(path.dirname(require.resolve("honkit/package.json")), "bin", "honkit.js");

rmSync(outputDir, { recursive: true, force: true });
for (const name of readdirSync(fixturesDir)) {
    execFileSync(process.execPath, [honkitBin, "build", path.join(fixturesDir, name), path.join(outputDir, name)], {
        stdio: "inherit"
    });
}
