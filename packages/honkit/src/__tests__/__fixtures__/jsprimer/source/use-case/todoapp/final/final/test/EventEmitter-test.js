const assert = require("assert");
import { EventEmitter } from "../src/EventEmitter.js";

describe("EventEmitter", function() {
    describe("#addEventListener", function() {
        it("should set event listener to the key", function(done) {
            const emitter = new EventEmitter();
            const key = "event-key";
            emitter.addEventListener(key, function() {
                done();
            });
            emitter.emit(key);
        });
    });
    describe("#emit", function() {
        it("should pass data to the listeners", function() {
            const emitter = new EventEmitter();
            const key = "event-key";
            let isListenerCalled = false;
            emitter.addEventListener(key, function() {
                isListenerCalled = true;
            });
            emitter.emit(key);
            assert.ok(isListenerCalled, "listener should be called");
        });
    });
    describe("#removeEventListener", function() {
        it("should unset event listener ", function(done) {
            const emitter = new EventEmitter();
            const key = "event-key";
            const listener = function() {
                done(new Error("should not called"));
            };
            emitter.addEventListener(key, listener);
            emitter.removeEventListener(key, listener);
            emitter.emit(key);
            emitter.addEventListener(key, done);
            emitter.emit(key);
        });
    });
});
