class Task {
    add(callback) {
        this.callback = callback;
    }

    invoke() {
        this.callback();
    }
}

const task = new Task();
try {
    task.add(() => {
        throw new Error("message");
    });
} catch (error) {
    console.log("Can not catch", error);
}
// ng
// task.invoke();
// ok
try {
    task.invoke();
} catch (error) {
    console.log("catch", error);
}
