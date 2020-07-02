try {
    new Promise(() => {
        throw new Error("message");
    });
} catch (error) {
    // UnhandledPromiseRejectionWarningとなりキャッチできない
    console.log("catch", error); // => Error: message
}
