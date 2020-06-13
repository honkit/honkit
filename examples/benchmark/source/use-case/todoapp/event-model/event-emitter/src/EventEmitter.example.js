import { EventEmitter } from "./EventEmitter.js";
const event = new EventEmitter();
// イベントリスナー（コールバック関数）を登録
event.addEventListener("test-event", () => console.log("One!"));
event.addEventListener("test-event", () => console.log("Two!"));
// イベントをディスパッチする
event.emit("test-event");
// コールバック関数がそれぞれ呼びだされ、コンソールには次のように出力される
// "One!"
// "Two!"