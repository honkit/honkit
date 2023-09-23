import is from "is";
import childProcess from "child_process";
import Promise from "./promise";

/**
 Execute a command

 @param {string} command
 @param {Object} options
 @return {Promise}
 */
function exec(command: string, options: { encoding?: "buffer" } & childProcess.ExecOptions) {
    const d = Promise.defer();

    const child = childProcess.exec(command, options, (err, stdout, stderr) => {
        if (!err) {
            return d.resolve();
        }

        err.message = stdout.toString() + stderr.toString();
        d.reject(err);
    });

    child.stdout.on("data", (data) => {
        d.notify(data);
    });

    child.stderr.on("data", (data) => {
        d.notify(data);
    });

    return d.promise;
}

/**
 Transform an option object to a command line string

 @param {String|number} value
 @param {string}
 */
function escapeShellArg(value: string) {
    if (is.number(value)) {
        return value;
    }

    value = String(value);
    value = value.replace(/"/g, '\\"');

    return `"${value}"`;
}

/**
 Transform a map of options into a command line arguments string

 @param {Object} options
 @return {string}
 */
function optionsToShellArgs(options) {
    const result = [];

    for (const key in options) {
        const value = options[key];

        if (value === null || value === undefined || value === false) {
            continue;
        }

        if (typeof value === "boolean") {
            result.push(key);
        } else {
            result.push(`${key}=${escapeShellArg(value)}`);
        }
    }

    return result.join(" ");
}

export default {
    exec: exec,
    optionsToShellArgs: optionsToShellArgs
};
