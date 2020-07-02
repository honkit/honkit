import { TodoItemModel } from "./TodoItemModel";
import { TodoListModel } from "./TodoListModel";
// 新しいTodoリストを作成する
const todoListModel = new TodoListModel();
// 現在のTodoアイテム数は0
console.log(todoListModel.getTotalCount()); // => 0
// Todoリストが変更されたら呼ばれるイベントリスナーを登録する
todoListModel.onChange(() => {
    console.log("TodoListの状態が変わりました");
});
// 新しいTodoアイテムを追加する
// => `onChange`で登録したイベントリスナーが呼び出される
const todoItemModel = new TodoItemModel({
    title: "新しいTodoアイテム",
    completed: false
});
todoListModel.addTodo(todoItemModel);
// Todoリストにアイテムが増える
console.log(todoListModel.getTotalCount()); // => 1
// 完了状態を更新する
todoListModel.updateTodo({
    id: todoItemModel.id,
    completed: true
});
todoListModel.getTodoItems().forEach(item => {
    console.log(item.completed); // => true
});
