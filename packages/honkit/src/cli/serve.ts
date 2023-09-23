import tinylr from "tiny-lr";
import open from "open";
import Immutable from "immutable";
import Parse from "../parse";
import Output from "../output";
import Modifiers from "../modifiers";

import Promise from "../utils/promise";
import options from "./options";
import getBook from "./getBook";
import getOutputFolder from "./getOutputFolder";
import Server from "./server";
import watch from "./watch";
import { clearCache } from "../output/page-cache";
import fs from "fs";

let server, lrServer, lrPath;

function waitForCtrlC() {
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
    const logger = book.getLogger();
    logger.info.ok("Starting server ...");
    let lastOutput = null;
    return Promise.all([
        server.start(outputFolder, port),
        generateBook({
            book,
            outputFolder,
            hasLiveReloading,
            Generator,
            reload
        }).then((output) => {
            lastOutput = output;
            return output;
        })
    ])
        .then(() => {
            console.log(`Serving book on http://localhost:${port}`);
            if (hasOpen) {
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
                // If the file does not exist in file system, show a warning and skip
                // Probably, the file has been deleted
                if (!fs.existsSync(filepath)) {
                    logger.warn.ok(`${filepath} does not exist in file system.`);
                    return;
                }
                // set livereload path
                lrPath = filepath;
                // TODO: use parse extension
                // Incremental update for pages
                if (lastOutput && filepath.endsWith(".md")) {
                    logger.warn.ok("Rebuild " + filepath);
                    const changedOutput = lastOutput.reloadPage(lastOutput.book.getContentRoot(), filepath).merge({
                        incrementalChangeFileSet: Immutable.Set([filepath])
                    });
                    return incrementalBuild({
                        output: changedOutput,
                        Generator
                    }).then(() => {
                        if (lrPath && hasLiveReloading) {
                            // trigger livereload
                            lrServer.changed({
                                body: {
                                    files: [lrPath]
                                }
                            });
                        }
                    });
                }
                // Asciidoc files are not supported for incremental build
                logger.info.ok("Rebuild " + filepath);
                return generateBook({
                    book,
                    outputFolder,
                    hasLiveReloading,
                    Generator,
                    reload
                }).then((output) => {
                    lastOutput = output;
                });
            });
        });
}

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
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
            config = Modifiers.Config.addPlugin(config, "livereload");
            resultBook = resultBook.set("config", config);
        }

        return Output.generate(Generator, resultBook, {
            root: outputFolder
        });
    });
}

function incrementalBuild({ output, Generator }) {
    return Output.incrementalBuild(Generator, output);
}

export default {
    name: "serve [book] [output]",
    description: "serve the book as a website for testing",
    options: [
        {
            name: "port",
            description: "Port for server to listen on",
            defaults: 4000
        },
        {
            name: "lrport",
            description: "Port for livereload server to listen on",
            defaults: 35729
        },
        {
            name: "watch",
            description: "Enable file watcher and live reloading",
            defaults: true
        },
        {
            name: "live",
            description: "Enable live reloading",
            defaults: true
        },
        {
            name: "open",
            description: "Enable opening book in browser",
            defaults: false
        },
        {
            name: "browser",
            description: "Specify browser for opening book",
            defaults: ""
        },
        options.log,
        options.format,
        options.reload
    ],
    exec: function (args, kwargs) {
        server = new Server();
        const hasWatch = kwargs["watch"];
        const hasLiveReloading = kwargs["live"];

        return Promise()
            .then(() => {
                if (!hasWatch || !hasLiveReloading) {
                    return;
                }

                lrServer = tinylr({});

                return Promise.nfcall(lrServer.listen.bind(lrServer), kwargs.lrport).then(() => {
                    console.log("Live reload server started on port:", kwargs.lrport);
                    console.log("Press CTRL+C to quit ...");
                    console.log("");
                });
            })
            .then(() => {
                return startServer(args, kwargs);
            });
    }
};
