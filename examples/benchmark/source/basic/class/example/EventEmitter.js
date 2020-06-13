class EventEmitter {
    constructor() {
        this.eventHandlers = [];
    }

    addEventListener(eventHandler) {
        this.eventHandlers.push(eventHandler);
    }

    emit(...args) {
        this.eventHandlers.forEach(handler => {
            handler(...args);
        });
    }
}

const event = new EventEmitter();
// listen
event.addEventListener(() => console.log("Hi"));
event.addEventListener((...args) => console.log("Hello", ...args));
// emit
event.emit("John");
