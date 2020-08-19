/* eslint-disable no-console */

const tinylr = require("tiny-lr");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'open'.
const open = require("open");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Parse'.
const Parse = require("../parse");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Output'.
const Output = require("../output");
const ConfigModifier = require("../modifiers").Config;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'options'.
const options = require("./options");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getBook'.
const getBook = require("./getBook");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getOutputF... Remove this comment to see the full error message
const getOutputFolder = require("./getOutputFolder");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Server'.
const Server = require("./server");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'watch'.
const watch = require("./watch");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clearCache... Remove this comment to see the full error message
const { clearCache } = require("../output/page-cache");

let server, lrServer, lrPath;

function waitForCtrlC() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defer' does not exist on type 'PromiseCo... Remove this comment to see the full error message
    const d = Promise.defer();

    process.on("SIGINT", () => {
        d.resolve();
    });

    return d.promise;
}

function startServer(args, kwargs) {
    const outputFolder = getOutputFolder(args);
    const port = kwargs.port;
    const browser = kwargs["browser"];
    const book = getBook(args, kwargs);
    const hasWatch = kwargs["watch"];
    const hasOpen = kwargs["open"];
    const hasLiveReloading = kwargs["live"];
    const reload = kwargs["reload"];
    const Generator = Output.getGenerator(kwargs.format);
    console.log("Starting server ...");
    let lastOutput = null;
    return Promise.all([
        server.start(outputFolder, port),
        generateBook({
            book,
            outputFolder,
            hasLiveReloading,
            Generator,
            reload,
        }).then((output) => {
            lastOutput = output;
            return output;
        }),
    ])
        .then(() => {
            console.log(`Serving book on http://localhost:${port}`);
            if (hasOpen) {
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ app: any; }' is not assignable... Remove this comment to see the full error message
                open(`http://localhost:${port}`, { app: browser });
            }
        })
        .then(() => {
            if (!hasWatch) {
                return waitForCtrlC();
            }
            // update book immutably. does not use book again
            return watch(book.getRoot(), (error, filepath) => {
                if (error) {
                    console.error(error);
                    return;
                }
                // set livereload path
                lrPath = filepath;
                // TODO: use parse extension
                // Incremental update for pages
                if (lastOutput && filepath.endsWith(".md")) {
                    console.log("Reload after change in file", filepath);
                    const changedOutput = lastOutput.reloadPage(lastOutput.book.getContentRoot(), filepath).merge({
                        incrementalChangeFileSet: Immutable.Set([filepath]),
                    });
                    return incrementalBuild({
                        output: changedOutput,
                        Generator,
                    }).then(() => {
                        if (lrPath && hasLiveReloading) {
                            // trigger livereload
                            lrServer.changed({
                                body: {
                                    files: [lrPath],
                                },
                            });
                        }
                    });
                }
                console.log("Rebuild after change in file", filepath);
                return generateBook({
                    book,
                    outputFolder,
                    hasLiveReloading,
                    Generator,
                    reload,
                }).then((output) => {
                    lastOutput = output;
                });
            });
        });
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function generateBook({ book, outputFolder, hasLiveReloading, Generator, reload }) {
    // Stop server if running
    if (reload) {
        book.getLogger().info.ok(`Clear cache`);
        clearCache();
    }

    return Parse.parseBook(book).then((resultBook) => {
        if (hasLiveReloading) {
            // Enable livereload plugin
            let config = resultBook.getConfig();
            config = ConfigModifier.addPlugin(config, "livereload");
            resultBook = resultBook.set("config", config);
        }

        return Output.generate(Generator, resultBook, {
            root: outputFolder,
        });
    });
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function incrementalBuild({ output, Generator }) {
    return Output.incrementalBuild(Generator, output);
}

module.exports = {
    name: "serve [book] [output]",
    description: "serve the book as a website for testing",
    options: [
        {
            name: "port",
            description: "Port for server to listen on",
            defaults: 4000,
        },
        {
            name: "lrport",
            description: "Port for livereload server to listen on",
            defaults: 35729,
        },
        {
            name: "watch",
            description: "Enable file watcher and live reloading",
            defaults: true,
        },
        {
            name: "live",
            description: "Enable live reloading",
            defaults: true,
        },
        {
            name: "open",
            description: "Enable opening book in browser",
            defaults: false,
        },
        {
            name: "browser",
            description: "Specify browser for opening book",
            defaults: "",
        },
        options.log,
        options.format,
        options.reload,
    ],
    exec: function (args, kwargs) {
        server = new Server();
        const hasWatch = kwargs["watch"];
        const hasLiveReloading = kwargs["live"];

        // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
        return Promise()
            .then(() => {
                if (!hasWatch || !hasLiveReloading) {
                    return;
                }

                lrServer = tinylr({});
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'nfcall' does not exist on type 'PromiseC... Remove this comment to see the full error message
                return Promise.nfcall(lrServer.listen.bind(lrServer), kwargs.lrport).then(() => {
                    console.log("Live reload server started on port:", kwargs.lrport);
                    console.log("Press CTRL+C to quit ...");
                    console.log("");
                });
            })
            .then(() => {
                return startServer(args, kwargs);
            });
    },
};
