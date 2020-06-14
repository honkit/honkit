import { render } from "./view/html-util.js";
import { TodoListView } from "./view/TodoListView.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { TodoListModel } from "./model/TodoListModel.js";

export class App {
    // 紐づけするHTML要素を引数として受け取る
    constructor({ formElement, formInputElement, todoListContainerElement, todoCountElement }) {
        this.todoListView = new TodoListView();
        this.todoListModel = new TodoListModel([]);
        // bind to Element
        this.formElement = formElement;
        this.formInputElement = formInputElement;
        this.todoListContainerElement = todoListContainerElement;
        this.todoCountElement = todoCountElement;
        // ハンドラ呼び出しで、`this`が変わらないように固定する
        // `this`が常に`App`のインスタンスを示すようにする
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * Todoを追加時に呼ばれるリスナー関数
     * @param {string} title
     */
    handleAdd(title) {
        this.todoListModel.addTodo(new TodoItemModel({ title, completed: false }));
    };

    /**
     * Todoの状態を更新時に呼ばれるリスナー関数
     * @param {{ id:number, completed: boolean }}
     */
    handleUpdate({ id, completed }) {
        this.todoListModel.updateTodo({ id, completed });
    };

    /**
     * Todoを削除時に呼ばれるリスナー関数
     * @param {{ id: number }}
     */
    handleDelete({ id }) {
        this.todoListModel.deleteTodo({ id });
    };

    /**
     * フォームを送信時に呼ばれるリスナー関数
     * @param {Event} event
     */
    handleSubmit(event) {
        event.preventDefault();
        const inputElement = this.formInputElement;
        this.handleAdd(inputElement.value);
        inputElement.value = "";
    }

    /**
     * TodoListViewが変更した時に呼ばれるリスナー関数
     */
    handleChange() {
        const todoCountElement = this.todoCountElement;
        const todoListContainerElement = this.todoListContainerElement;
        const todoItems = this.todoListModel.getTodoItems();
        const todoListElement = this.todoListView.createElement(todoItems, {
            // Appに定義したリスナー関数を呼び出す
            onUpdateTodo: ({ id, completed }) => {
                this.handleUpdate({ id, completed });
            },
            onDeleteTodo: ({ id }) => {
                this.handleDelete({ id });
            }
        });
        render(todoListElement, todoListContainerElement);
        todoCountElement.textContent = `Todoアイテム数: ${this.todoListModel.getTotalCount()}`;
    }

    /**
     * アプリとDOMの紐づけを登録する関数
     */
    mount() {
        this.todoListModel.onChange(this.handleChange);
        this.formElement.addEventListener("submit", this.handleSubmit);
    }

    /**
     * アプリとDOMの紐づけを解除する関数
     */
    unmount() {
        this.todoListModel.offChange(this.handleChange);
        this.formElement.removeEventListener("submit", this.handleSubmit);
    }
}
