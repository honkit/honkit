// Build the assets of the default theme into `_assets/`.
//
// - JavaScript: bundled and minified with esbuild
// - CSS: bundled (`@import`) and minified with esbuild
// - Images and fonts: copied
import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

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
    await esbuild.build({
        entryPoints: [fromPackage(entry)],
        outfile: path.join(assetsDir, outfile),
        bundle: true,
        minify: true,
        target: TARGET,
        // Fonts are copied next to the stylesheet (see below)
        external: ["./fonts/*"],
        legalComments: "inline",
        logLevel: "warning"
    });
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
        buildCss("src/css/website.css", "website/style.css"),
        buildCss("src/css/ebook.css", "ebook/ebook.css"),
        buildCss("src/css/epub.css", "ebook/epub.css"),
        buildCss("src/css/mobi.css", "ebook/mobi.css"),
        buildCss("src/css/pdf.css", "ebook/pdf.css"),
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
