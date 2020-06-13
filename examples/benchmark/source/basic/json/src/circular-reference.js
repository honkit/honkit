const obj = { foo: "foo" };
obj.self = obj;
try {
    JSON.stringify(obj);
} catch (error) {
    console.error(error); // => "TypeError: Converting circular structure to JSON"
}
