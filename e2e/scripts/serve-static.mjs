// Minimal static file server for the built fixture books.
// It behaves like common static hosting: `/dir/` serves `/dir/index.html`,
// unknown paths return 404, and nothing is rewritten.
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rootDir = path.resolve(process.env.ROOT_DIR ?? path.join(packageDir, "dist"));
const port = Number(process.env.PORT ?? 4180);

const CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "font/otf"
};

const resolveFile = (urlPath) => {
    const filePath = path.join(rootDir, decodeURIComponent(urlPath));
    if (!filePath.startsWith(rootDir)) {
        return null;
    }
    try {
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            const indexPath = path.join(filePath, "index.html");
            return statSync(indexPath).isFile() ? indexPath : null;
        }
        return stat.isFile() ? filePath : null;
    } catch {
        return null;
    }
};

createServer((req, res) => {
    const { pathname } = new URL(req.url ?? "/", "http://localhost");
    const filePath = resolveFile(pathname);
    if (!filePath) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found");
        return;
    }
    res.writeHead(200, {
        "Content-Type": CONTENT_TYPES[path.extname(filePath)] ?? "application/octet-stream"
    });
    createReadStream(filePath).pipe(res);
}).listen(port, "127.0.0.1", () => {
    console.log(`Serving ${rootDir} at http://127.0.0.1:${port}/`);
});
