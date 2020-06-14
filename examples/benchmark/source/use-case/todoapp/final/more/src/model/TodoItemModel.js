// ユニークなIDを管理する変数
let todoIdx = 0;

export class TodoItemModel {
    /**
     * `title`: Todoアイテムのタイトル
     * `completed`: Todoアイテムが完了済みならばtrue、そうでない場合はfalse
     * @param {{ title: string, completed: boolean }}
     */
    constructor({ title, completed }) {
        // idは自動的に連番となりそれぞれのインスタンス毎に異なるものとする
        this.id = todoIdx++;
        this.title = title;
        this.completed = completed;
    }

    /**
     * タイトルが空文字列の場合にtrueを返す
     * @returns {boolean}
     */
    isEmptyTitle() {
        return this.title.length === 0;
    }
}
