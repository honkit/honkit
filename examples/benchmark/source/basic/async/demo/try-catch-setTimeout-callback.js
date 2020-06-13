try {
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timer-initialisation-steps
    // setTimeoutはこのスコープではなくグローバルスコープで実行される
    setTimeout(() => {
        throw new Error("message");
    });
} catch (error) {
    console.log(error); // => Error: message
}
