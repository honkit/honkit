import is from "is";
import util from "util";
import color from "bash-color";
import Immutable from "immutable";

const LEVELS = Immutable.Map({
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    DISABLED: 10
});

const COLORS = Immutable.Map({
    DEBUG: color.purple,
    INFO: color.cyan,
    WARN: color.yellow,
    ERROR: color.red
});

function Logger(write, logLevel) {
    // @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
    if (!(this instanceof Logger)) return new Logger(write, logLevel);

    this._write =
        write ||
        function (msg) {
            if (process.stdout) {
                process.stdout.write(msg);
            }
        };
    this.lastChar = "\n";

    this.setLevel(logLevel || "info");

    // Create easy-to-use method like "logger.debug.ln('....')"
    LEVELS.forEach(function (level, levelKey) {
        if (levelKey === "DISABLED") {
            return;
        }
        levelKey = levelKey.toLowerCase();

        this[levelKey] = this.log.bind(this, level);
        this[levelKey].ln = this.logLn.bind(this, level);
        this[levelKey].ok = this.ok.bind(this, level);
        this[levelKey].fail = this.fail.bind(this, level);
        this[levelKey].promise = this.promise.bind(this, level);
    }, this);
}

/**
 Change minimum level

 @param {string} logLevel
 */
Logger.prototype.setLevel = function (logLevel) {
    if (is.string(logLevel)) {
        logLevel = logLevel.toUpperCase();
        logLevel = LEVELS.get(logLevel);
    }

    this.logLevel = logLevel;
};

/**
 Return minimum logging level

 @return {number}
 */
Logger.prototype.getLevel = function (logLevel) {
    return this.logLevel;
};

/**
 Print a simple string

 @param {string}
 */
Logger.prototype.write = function (msg) {
    msg = msg.toString();
    this.lastChar = msg[msg.length - 1];
    return this._write(msg);
};

/**
 Format a string using the first argument as a printf-like format.
 */
Logger.prototype.format = function () {
    return util.format.apply(util, arguments);
};

/**
 Print a line

 @param {string}
 */
Logger.prototype.writeLn = function (msg) {
    return this.write(`${msg || ""}\n`);
};

/**
 Log/Print a message if level is allowed

 @param {number} level
 */
Logger.prototype.log = function (level) {
    if (level < this.logLevel) return;

    const levelKey = LEVELS.findKey((v) => {
        return v === level;
    });
    const args = Array.prototype.slice.apply(arguments, [1]);
    let msg = this.format.apply(this, args);

    if (this.lastChar == "\n") {
        msg = `${COLORS.get(levelKey)(`${levelKey.toLowerCase()}:`)} ${msg}`;
    }

    return this.write(msg);
};

/**
 Log/Print a line if level is allowed
 */
Logger.prototype.logLn = function () {
    if (this.lastChar != "\n") this.write("\n");

    const args = Array.prototype.slice.apply(arguments);
    args.push("\n");
    return this.log.apply(this, args);
};

/**
 Log a confirmation [OK]
 */
Logger.prototype.ok = function (level) {
    const args = Array.prototype.slice.apply(arguments, [1]);
    const msg = this.format.apply(this, args);
    if (arguments.length > 1) {
        this.logLn(level, color.green(">> ") + msg.trim().replace(/\n/g, color.green("\n>> ")));
    } else {
        this.log(level, color.green("OK"), "\n");
    }
};

/**
 Log a "FAIL"
 */
Logger.prototype.fail = function (level) {
    return this.log(level, `${color.red("ERROR")}\n`);
};

/**
 Log state of a promise

 @param {number} level
 @param {Promise}
 @return {Promise}
 */
Logger.prototype.promise = function (level, p) {
    const that = this;

    return p.then(
        (st) => {
            that.ok(level);
            return st;
        },
        (err) => {
            that.fail(level);
            throw err;
        }
    );
};

Logger.LEVELS = LEVELS;

export default Logger;
