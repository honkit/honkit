import events from "events";
import http from "http";
import send from "send";
import util from "util";
import url from "url";
import Promise from "../utils/promise";

class Server extends events.EventEmitter {
    private running: http.Server;
    private dir: null;
    private port: number;
    private sockets: any[];
    constructor() {
        super();
        this.running = null;
        this.dir = null;
        this.port = 0;
        this.sockets = [];
    }

    /**
     Return true if the server is running

     @return {boolean}
     */
    isRunning() {
        return !!this.running;
    }

    /**
     Stop the server

     @return {Promise}
     */
    stop() {
        const that = this;

        if (!this.isRunning()) return Promise();

        const d = Promise.defer();
        this.running.close((err) => {
            that.running = null;
            that.emit("state", false);

            if (err) d.reject(err);
            else d.resolve();
        });

        for (let i = 0; i < this.sockets.length; i++) {
            this.sockets[i].destroy();
        }

        return d.promise;
    }

    /**
     Start the server

     @return {Promise}
     */
    start(dir, port) {
        const that = this;

        let pre = Promise();
        port = port || 8004;

        if (that.isRunning()) pre = this.stop();
        return pre.then(() => {
            const d = Promise.defer();

            that.running = http.createServer((req, res) => {
                // Render error
                function error(err) {
                    res.statusCode = err.status || 500;
                    res.end(err.message);
                }

                // Redirect to directory's index.html
                function redirect() {
                    const resultURL = urlTransform(req.url, (parsed) => {
                        parsed.pathname += "/";
                        return parsed;
                    });

                    res.statusCode = 301;
                    res.setHeader("Location", resultURL);
                    res.end(`Redirecting to ${resultURL}`);
                }

                res.setHeader("X-Current-Location", req.url);

                // Send file
                send(req, url.parse(req.url).pathname, {
                    root: dir
                })
                    .on("error", error)
                    .on("directory", redirect)
                    .pipe(res);
            });

            that.running.on("connection", (socket) => {
                that.sockets.push(socket);
                socket.setTimeout(4000);
                socket.on("close", () => {
                    that.sockets.splice(that.sockets.indexOf(socket), 1);
                });
            });

            that.running.listen(port, () => {
                that.port = port;
                that.dir = dir;
                that.emit("state", true);
                d.resolve();
            });

            return d.promise;
        });
    }
}

/**
 urlTransform is a helper function that allows a function to transform
 a url string in it's parsed form and returns the new url as a string

 @param {string} uri
 @param {Function} fn
 @return {string}
 */
function urlTransform(uri, fn) {
    return url.format(fn(url.parse(uri)));
}

export default Server;
