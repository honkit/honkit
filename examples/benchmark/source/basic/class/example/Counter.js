class Counter {
    constructor() {
        this.count = 0;
    }

    increment() {
        this.count++;
    }
}

const counter = new Counter();
console.log(counter.count); // => 0
counter.increment();
console.log(counter.count); // => 1
