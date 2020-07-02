import { TodoItemModel } from "./TodoItemModel.js";
const item = new TodoItemModel({
    title: "未完了のTodoアイテム",
    completed: false
});
const completedItem = new TodoItemModel({
    title: "完了済みのTodoアイテム",
    completed: true
});
// それぞれの`id`は異なる
console.log(item.id !== completedItem.id); // => true
