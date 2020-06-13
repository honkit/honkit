function* gen() {
    while (true) {
        yield 42;
    }
}

try {
    const g = gen();
    setTimeout(() => {
        g.next(); // { value: 42, done: false }
        g.throw(new Error("message"));
    });
} catch (error) {
    // キャッチできる
    // g.throwによってCompletionが伝播する
    console.log("catch", error);
}
