import path from "path";
import childProcess from "child_process";
import Promise from "../../utils/promise";
import error from "../../utils/error";
import getConvertOptions from "./getConvertOptions";
import { SUMMARY_FILE } from "./writeSummary";

/** Preserve Calibre's --option=value syntax without passing values through a shell. */
export function convertOptionsToArgs(options: Record<string, unknown>): string[] {
    return Object.entries(options).flatMap(([key, value]) => {
        if (value === null || value === undefined || value === false) return [];
        return [value === true ? key : `${key}=${String(value)}`];
    });
}

/** Convert HTML with Calibre. A separate destination is used for pagination passes. */
function runEbookConvert(output, destination?: string) {
    const logger = output.getLogger();
    const format = output.getOptions().get("format");
    const outputFolder = output.getRoot();
    if (!format) return Promise(output);

    return getConvertOptions(output)
        .then((options) => {
            const deferred = Promise.defer();
            const args = [
                path.resolve(outputFolder, SUMMARY_FILE),
                destination || path.resolve(outputFolder, `index.${format}`),
                ...convertOptionsToArgs(options)
            ];
            // Paths and metadata can contain spaces, quotes or shell expansion
            // characters. execFile keeps them literal on Windows and POSIX.
            const child = childProcess.execFile("ebook-convert", args, (err, stdout, stderr) => {
                if (!err) return deferred.resolve();
                if (err.code === "ENOENT") {
                    return deferred.reject(
                        error.RequireInstallError({
                            cmd: "ebook-convert",
                            install: "Install it from Calibre: https://calibre-ebook.com"
                        })
                    );
                }
                err.message = stdout.toString() + stderr.toString() || err.message;
                deferred.reject(error.EbookError(err));
            });
            child.stdout.on("data", (data) => logger.debug(data));
            child.stderr.on("data", (data) => logger.debug(data));
            return deferred.promise;
        })
        .thenResolve(output);
}

export default runEbookConvert;
