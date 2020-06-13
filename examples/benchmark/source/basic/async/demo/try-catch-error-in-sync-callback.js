/*
    コールバック内で起きたエラーだからcatchできなくなるわけではないという話
 */
const ThrowFn = (callback) => {
    callback();
};

try {
    ThrowFn(() => {
        throw new Error("message");
    });
} catch (error) {
    console.error(error); // => Error: message
}
