// Build the assets of the default theme into `_assets/`.
//
// - JavaScript: bundled and minified with esbuild
// - CSS: compiled from LESS and minified with esbuild
// - Images and fonts: copied
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import less from "less";

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fromPackage = (...segments) => path.join(packageDir, ...segments);
const assetsDir = fromPackage("_assets");

// Browsers supported by the output (modern browsers only)
const TARGET = ["chrome100", "edge100", "firefox100", "safari15"];

const buildJs = async (entry, outfile) => {
    await esbuild.build({
        entryPoints: [fromPackage(entry)],
        outfile: path.join(assetsDir, outfile),
        bundle: true,
        minify: true,
        format: "iife",
        target: TARGET,
        legalComments: "eof",
        logLevel: "warning"
    });
};

const buildCss = async (entry, outfile) => {
    const input = fromPackage(entry);
    const { css } = await less.render(await readFile(input, "utf8"), {
        filename: input,
        // Keep the LESS 2 behavior: evaluate every math operation (e.g. `@a / 2`)
        math: "always"
    });
    const result = await esbuild.transform(css, {
        loader: "css",
        minify: true,
        target: TARGET,
        legalComments: "inline"
    });
    await writeFile(path.join(assetsDir, outfile), result.code);
};

const copy = async (from, to) => {
    const destination = path.join(assetsDir, to);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(fromPackage(from), destination);
};

const main = async () => {
    await rm(assetsDir, { recursive: true, force: true });
    await Promise.all(
        ["ebook", "website", "website/fonts/fontawesome", "website/images"].map((dir) => {
            return mkdir(path.join(assetsDir, dir), { recursive: true });
        })
    );

    await Promise.all([
        buildJs("src/js/core/index.js", "website/gitbook.js"),
        buildJs("src/js/theme/index.js", "website/theme.js"),
        buildJs("src/js/boot.js", "website/boot.js"),
        buildCss("src/less/website.less", "website/style.css"),
        buildCss("src/less/ebook.less", "ebook/ebook.css"),
        buildCss("src/less/epub.less", "ebook/epub.css"),
        buildCss("src/less/mobi.less", "ebook/mobi.css"),
        buildCss("src/less/pdf.less", "ebook/pdf.css"),
        copy("src/css/noscript.css", "website/noscript.css"),
        copy("logo/favicon.ico", "website/images/favicon.ico"),
        copy("logo/apple-touch-icon.png", "website/images/apple-touch-icon-precomposed-152.png"),
        copy("font-awesome/fonts/fontawesome-webfont.woff2", "website/fonts/fontawesome/fontawesome-webfont.woff2"),
        copy("font-awesome/fonts/fontawesome-webfont.woff", "website/fonts/fontawesome/fontawesome-webfont.woff")
    ]);
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
