// Use the same server implementation as `honkit serve`, including X-Current-Location.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const Server = require("honkit/lib/cli/server").default;
const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const server = new Server();
server.start(path.join(packageDir, "dist"), Number(process.env.PREVIEW_PORT ?? 4181)).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
