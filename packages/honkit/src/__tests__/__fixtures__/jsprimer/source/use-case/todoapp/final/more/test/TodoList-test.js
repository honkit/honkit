const assert = require("assert");
import { TodoItemModel } from "../src/model/TodoItemModel.js";
import { TodoListModel } from "../src/model/TodoListModel.js";

const assertTodo = (todo) => {
    assert.ok(typeof todo.id === "number");
    assert.ok(typeof todo.title === "string");
    assert.ok(todo.title.length > 0);
    assert.ok(typeof todo.completed === "boolean");
};

describe("TodoList", function() {
    describe("#add", () => {
        it("should add new Todo Item", () => {
            const list = new TodoListModel();
            list.addTodo(new TodoItemModel({ title: "test", completed: false }));
            const todoItems = list.getTodoItems();
            assert.strictEqual(todoItems.length, 1);
            assertTodo(todoItems[0]);
        });
    });
    describe("#update", () => {
        it("should update new Todo Item", () => {
            const list = new TodoListModel();
            const todoItem = new TodoItemModel({ title: "test", completed: false });
            list.addTodo(todoItem);
            list.updateTodo({ id: todoItem.id, completed: true });
            const todoItems = list.getTodoItems();
            assert.strictEqual(todoItems[0].completed, true);
        });
    });
    describe("#delete", () => {
        it("should remove new Todo Item", () => {
            const list = new TodoListModel();
            const todoItem = new TodoItemModel({ title: "test", completed: false });
            list.addTodo(todoItem);
            list.deleteTodo({ id: todoItem.id });
            const todoItems = list.getTodoItems();
            assert.ok(todoItems.length === 0);
        });
    });
});
