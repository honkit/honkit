try {
    // Functionはグロールスコープの直下で実行される
    new Function("throw new Error(\"message\");")();
} catch (error) {
    // catchできる
    console.log("Catch", error); // => Error: message
}
