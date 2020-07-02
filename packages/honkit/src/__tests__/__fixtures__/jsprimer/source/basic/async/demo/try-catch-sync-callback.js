const ThrowFn = (callback) => {
    throw new Error("message");
    callback();
};
try {
    ThrowFn(() => {});
} catch (error) {
    console.error(error); // => Error: message
}
