---
author: azu
description: "操作と更新が密結合になってしまい変更がしにくくなる問題を「モデル」と「イベント」を用いて改善する方法を見ていきます。"
---

# イベントとモデル {#event-model}

Todoアイテムを追加する機能を実装しましたが、イベントを受け取って直接DOMを更新する方法には柔軟性がないという問題があります。
また「Todoアイテムの更新」という機能を実装するには、追加したTodoアイテム要素を識別する方法が必要です。
具体的には、Todoアイテムごとに`id`属性などのユニークな識別子がないため、特定のアイテムを指定して更新や削除をする機能が実装できません。

このセクションでは、まずどのような点で柔軟性の問題が起きやすいのかを見ていきます。
そして、柔軟性や識別子の問題を解決するために**モデル**という概念を導入し、「Todoアイテムの追加」の機能をリファクタリングしていきます。


## 直接DOMを更新する問題 {#direct-dom-modification-issue}

「[Todoアイテムの追加を実装する][]」では、操作した結果発生したイベントという入力に対して、DOM（表示）を直接更新していました。
そのため、TodoリストにTodoアイテムが何個あるか、どのようなアイテムがあるかという状態がDOM上にしか存在しないことになります。

この場合にTodoアイテムの状態を更新するには、HTML要素にTodoアイテムの情報（タイトルや識別子となるidなど）をすべて埋め込む必要があります。
しかし、HTML要素は文字列しか扱えないため、Todoアイテムのデータを文字列にしないといけないという制限が発生します。

また、1つの操作に対して複数の箇所の表示が更新されることもあります。
今回のTodoアプリでもTodoリスト（`#js-todo-list`）とTodoアイテム数（`#js-todo-count`）の2箇所を更新する必要があります。

次の表に**操作**に対して更新する**表示**をまとめてみます。

| 機能               | 操作                       | 表示                                                                                                                   |
| ------------------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Todoアイテムの追加 | フォームを入力して送信       | Todoリスト（`#js-todo-list`）にTodoアイテム要素を作成して子要素として追加。合わせてTodoアイテム数（`#js-todo-count`）を更新 |
| Todoアイテムの更新 | チェックボックスをクリック | Todoリスト（`#js-todo-list`）にある指定したTodoアイテム要素のチェック状態を更新                                          |
| Todoアイテムの削除 | 削除ボタンをクリック       | Todoリスト（`#js-todo-list`）にある指定したTodoアイテム要素を削除。合わせてTodoアイテム数（`#js-todo-count`）を更新       |

1つの操作に対する表示の更新箇所が増えるほど、操作に対する処理（リスナーの処理）が複雑化していくことが予想できます。

ここでは、次の2つの問題が見つかりました。

- Todoリストの状態がDOM上にしか存在しないため、状態をすべてDOM上に文字列で埋め込まないといけない
- 操作に対して更新する表示箇所が増えてくると、表示の処理が複雑化する

## モデルを導入する {#introduce-model}

この問題を避けるために、Todoアイテムという情報をJavaScriptクラスとしてモデル化します。
ここでのモデルとはTodoアイテムやTodoリストなどの**モノの状態や操作方法**を定義したオブジェクトという意味です。
クラスでは操作方法はメソッドとして実装し、状態はインスタンスのプロパティで管理できるため、今回はクラスでモデルを表現します。

たとえば、Todoリストを表現するモデルとして`TodoListModel`クラスを考えます。
TodoリストにはTodoアイテムを追加できるので、`TodoListModel#addItem`というメソッドがあると良さそうです。
また、Todoリストからアイテムの一覧を取得できる必要もあるので、`TodoListModel#getAllItems`というメソッドも必要そうです。
このようにTodoリストをクラスで表現する際に、オブジェクトがどのような処理や状態を持つかを考えて実装します。

このようにモデルを考えた後、先ほどの操作と表示の間にモデルを入れることを考えてみます。
「フォームを入力して送信」という**操作**をした場合には、`TodoListModel`（Todoリスト）に対して`TodoItemModel`（Todoアイテム）を追加します。
そして、`TodoListModel`からTodoアイテムの一覧を取得し、それを元にDOMを組み立て、**表示**を更新します。

先ほどの表にモデルを入れてみます。
**操作**に対する**モデルの処理**はさまざまですが、**操作**に対する**表示**の処理はどの場合も同じになります。
これは表示箇所が増えた場合でも**表示**の処理の複雑さが一定に保てることを意味しています。

| 機能               | 操作                       | モデルの処理                                                                            | 表示                            |
| ------------------ | -------------------------- | --------------------------------------------------------------------------------------- | ------------------------------- |
| Todoアイテムの追加 | フォームを入力して送信       | `TodoListModel`へ新しい`TodoItemModel`を追加                                            | `TodoListModel`を元に表示を更新 |
| Todoアイテムの更新 | チェックボックスをクリック | `TodoListModel`の指定した`TodoItemModel`の状態を更新                                    | `TodoListModel`を元に表示を更新 |
| Todoアイテムの削除 | 削除ボタンをクリック       | `TodoListModel`から指定の`TodoItemModel`を削除                                          | `TodoListModel`を元に表示を更新 |

この表を元に改めて先ほどの問題点を見ていきましょう。

> Todoリストの状態がDOM上にしか存在しないため、状態をすべてDOM上に文字列で埋め込まないといけない

モデルであるクラスのインスタンスを参照すれば、Todoアイテムの情報が手に入ります。
またモデルはただのJavaScriptクラスであるため、文字列ではない情報も保持できます。
そのため、DOMにすべての情報を埋め込む必要はありません。

> 操作に対して更新する表示箇所が増えてくると、表示の処理が複雑化する

表示はモデルの状態を元にしてHTML要素を作成し、表示を更新します。
モデルの状態が変化していなければ、表示は変わらなくても問題ありません。

そのため操作したタイミングではなく、モデルの状態が変化したタイミングで表示を更新すればよいはずです。
具体的には「フォームを入力して送信」されたから表示を更新するのではなく、
「`TodoListModel`というモデルの状態が変化」したから表示を更新すればいいはずです。

そのためには、`TodoListModel`というモデルの状態が変化したことを表示側から知る必要があります。
ここで再び出てくるのがイベントです。

## モデルの変化を伝えるイベント {#model-and-event}

フォームを送信したらform要素から`submit`イベントが発生します。
これと同じように`TodoListModel`の状態が変化したら自分自身へ`change`イベントを発生（ディスパッチ）させます。
表示側はそのイベントをリッスンしてイベントが発生したら表示を更新すればよいはずです。

`TodoListModel`の状態の変化とは、「`TodoListModel`に新しい`TodoItemModel`が追加される」などが該当します。
先ほどの表の「モデルの処理」は何かしら状態が変化しているので、表示を更新する必要があるわけです。

DOM APIのイベントの仕組みをモデルでも利用できれば、モデルが更新されたら表示を更新する仕組みを作れそうです。
ブラウザのDOM APIでは、DOM Eventsと呼ばれるイベントの仕組みが利用できます。
Node.jsでは、`events`と呼ばれる組み込みのモジュールで同様のイベントの仕組みが利用できます。

実行環境が提供するイベントの仕組みを利用すると簡単ですが、ここではイベントの仕組みを理解するために、イベントのディスパッチとリッスンする機能を持つクラスを作ってみましょう。

とても難しく聞こえますが、今まで学んだクラスやコールバック関数などを使えば実現できます。

## EventEmitter {#event-emitter}

イベントの仕組みとは「イベントをディスパッチする側」と「イベントをリッスンする側」の2つの面から成り立ちます。
場合によっては自分自身へイベントをディスパッチし、自分自身でイベントをリッスンすることもあります。

このイベントの仕組みを言い換えると「イベントをディスパッチした（イベントを発生させた）ときにイベントをリッスンしているコールバック関数（イベントリスナー）を呼び出す」となります。

モデルが更新されたら表示を更新するには「`TodoListModel`が更新されたときに指定したコールバック関数を呼び出すクラス」を作れば目的は達成できます。
しかし、「`TodoListModel`が更新されたとき」というのはとても具体的な処理であるため、モデルを増やすたびに同じ処理をそれぞれのモデルへ実装するのは大変です。

そのため、先ほどのイベントの仕組みを持った概念として`EventEmitter`というクラスを作成します。
そして`TodoListModel`は作成した`EventEmitter`を継承することでイベントの仕組みを導入していきます。

- 親クラス（`EventEmitter`）: イベントをディスパッチしたとき、登録されているコールバック関数（イベントリスナー）を呼び出すクラス
- 子クラス（`TodoListModel`）: 値を更新したとき、登録されているコールバック関数を呼び出すクラス

まずは、親クラスとなる`EventEmitter`を作成していきます。

`EventEmitter`はイベントの仕組みで書いたディスパッチ側とリッスン側の機能を持ったクラスとなります。

- ディスパッチ側: `emit`メソッドは、指定された`イベント名`に登録済みのすべてのコールバック関数を呼び出す
- リッスン側: `addEventListener`メソッドは、指定した`イベント名`に任意のコールバック関数を登録できる

これによって、`emit`メソッドを呼び出すと指定したイベントに関係する登録済みのコールバック関数を呼び出せます。
このようなパターンはObserverパターンとも呼ばれ、ブラウザやNode.jsなど多くの実行環境に類似するAPIが存在します。

次のように`src/EventEmitter.js`へ`EventEmitter`クラスを定義します。

[import, title:"src/EventEmitter.js"](./event-emitter/src/EventEmitter.js)

この`EventEmitter`では次のようにイベントのリッスンとイベントのディスパッチの機能が利用できます。
リッスン側は`addEventListener`メソッドでイベントの種類（`type`）に対するイベントリスナー（`listener`）を登録します。
ディスパッチ側は`emit`メソッドでイベントをディスパッチし、イベントリスナーを呼び出します。

次のコードでは、`addEventListener`メソッドで`test-event`イベントに対して2つのイベントリスナーを登録しています。
そのため、`emit`メソッドで`test-event`イベントをディスパッチすると、登録済みのイベントリスナーが呼び出されています。

[import, title:"EventEmitterの実行サンプル"](./event-emitter/src/EventEmitter.example.js)

## EventEmitterを継承したTodoListモデル {#event-emitter-todolist-model}

次は作成した`EventEmitter`クラスを継承した`TodoListModel`クラスを作成しています。
`src/model/`ディレクトリを新たに作成し、このディレクトリに各モデルクラスを実装したファイルを作成します。

作成するモデルは、Todoリストを表現する`TodoListModel`と各Todoアイテムを表現する`TodoItemModel`です。
`TodoListModel`が複数の`TodoItemModel`を保持することでTodoリストを表現することになります。

- `TodoListModel`: Todoリストを表現するモデル
- `TodoItemModel`: Todoアイテムを表現するモデル

まずは`TodoItemModel`を`src/model/TodoItemModel.js`というファイル名で作成します。

`TodoItemModel`クラスは各Todoアイテムに必要な情報を定義します。
各Todoアイテムにはタイトル（`title`）、アイテムの完了状態（`completed`）、アイテムごとにユニークな識別子（`id`）を持たせます。
ただのデータの集合であるため、クラスではなくオブジェクトでも問題はありませんが、今回はクラスとして作成します。

次のように`src/model/TodoItemModel.js`へ`TodoItemModel`クラスを定義します。

[import, title:"src/model/TodoItemModel.js"](./event-emitter/src/model/TodoItemModel.js)

次のコードでは`TodoItemModel`クラスはインスタンス化でき、それぞれの`id`が自動的に異なる値となっていることが確認できます。
この`id`は後ほど特定のTodoアイテムを指定して更新する処理のときに、アイテムを区別する識別子として利用します。

[import title:"TodoItemModel.jsを利用するサンプルコード"](./event-emitter/src/model/TodoItemModel.example.js)

次に`TodoListModel`を`src/model/TodoListModel.js`というファイル名で作成します。

`TodoListModel`クラスは、先ほど作成した`EventEmitter`クラスを継承します。
`TodoListModel`クラスは`TodoItemModel`の配列を保持し、新しいTodoアイテムを追加する際はその配列に追加します。
このとき`TodoListModel`の状態が変更したことを通知するために自分自身へ`change`イベントをディスパッチします。

[import, title:"src/model/TodoListModel.js"](./event-emitter/src/model/TodoListModel.js)

次のコードは`TodoListModel`クラスのインスタンスに対して、新しい`TodoItemModel`を追加するサンプルコードです。
`TodoListModel#addTodo`メソッドで新しいTodoアイテムを追加したときに、`TodoListModel#onChange`で登録したイベントリスナーが呼び出されます。

[import, title:"TodoListModel.jsを利用するサンプルコード"](./event-emitter/src/model/TodoListModel.example.js)

これでTodoリストに必要なそれぞれのモデルクラスが作成できました。
次はこれらのモデルを使って、表示の更新をしてみましょう。

## モデルを使って表示を更新する {#model-update-view}

先ほど作成した`TodoListModel`と`TodoItemModel`クラスを使って、「Todoアイテムの追加」を書き直してみます。

前回のコードでは、フォームを送信すると直接DOMへ要素を追加していました。
今回のコードでは、フォームを送信すると`TodoListModel`へ`TodoItemModel`を追加します。
`TodoListModel`に新しいTodoアイテムが増えると、`onChange`に登録したイベントリスナーが呼び出されるため、
そのリスナー関数内でDOM（表示）を更新します。

まずは書き換え後の`App.js`を見ていきます。

[import, title:"src/App.js"](./event-emitter/src/App.js)

変更後の`App.js`では大きく分けて3つの部分が変更されているので、順番に見ていきます。

### 1. TodoListの初期化 {#app-todolist-initialize}

作成した`TodoListModel`と`TodoItemModel`をインポートしています。

<!-- doctest:disable -->
```js
import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
```

そして、`App`クラスのコンストラクタ内で`TodoListModel`を初期化しています。
`App`のコンストラクタで`TodoListModel`を初期化しているのは、
このTodoアプリでは開始時にTodoリストの中身が空の状態で開始されるのに合わせるためです。

<div class="code-filename-block"><p class="code-filename">src/App.jsより抜粋</p></div>

<!-- doctest:disable -->
```js
// ...省略...
export class App {
    constructor() {
        // 1. TodoListの初期化
        this.todoListModel = new TodoListModel();
    }
    // ...省略...
}
```

### 2. TodoListModelの状態が更新されたら表示を更新する {#app-todolist-onchange}

`mount`メソッド内で`TodoListModel`が更新されたら表示を更新するという処理を実装します。
`TodoListModel#onChange`で登録したリスナー関数は、`TodoListModel`の状態が更新されたら呼び出されます。

このリスナー関数内では`TodoListModel#getTodoItems`でTodoアイテムを取得しています。
そして、アイテム一覧から次のようなリスト要素（`todoListElement`）を作成しています。

```html
<!-- todoListElementの実質的な中身 -->
<ul>
    <li>Todoアイテム 1のタイトル</li>
    <li>Todoアイテム 2のタイトル</li>
</ul>
```

この作成した`todoListElement`要素を、前回作成した`html-util.js`の`render`関数を使って`containerElement`の中身に上書きしています。
また、アイテム数は`TodoListModel#getTotalCount`メソッドで取得できるため、アイテム数を管理していた`todoItemCount`という変数は削除できます。

<div class="code-filename-block"><p class="code-filename">src/App.jsより抜粋</p></div>

<!-- doctest:disable -->
```js
// render関数をimportに追加する
import { element, render } from "./view/html-util.js";
export class App {
    // ...省略...
    mount() {
        // ...省略...
        this.todoListModel.onChange(() => {
            // ...省略...
            // containerElementの中身をtodoListElementで上書きする
            render(todoListElement, containerElement);
            // アイテム数の表示を更新
            todoItemCountElement.textContent = `Todoアイテム数: ${this.todoListModel.getTotalCount()}`;
        });
        // ...省略...
    }
}
```

### 3. フォームを送信したら、新しいTodoItemを追加する {#app-add-new-todoitem}

前回のコードでは、フォームを送信（`submit`）すると直接DOMへ要素を追加していました。
今回のコードでは、`TodoListModel`の状態が更新されたら表示を更新する仕組みがすでにできています。

そのため、`submit`イベントのリスナー関数内では`TodoListModel`に対して新しい`TodoItemModel`を追加するだけで表示が更新されます。
直接DOMへ`appendChild`していた部分を`TodoListModel#addTodo`メソッドを使ってモデルを更新する処理へ置き換えるだけです。

## まとめ {#conclusion}

今回のセクションでは、前セクションの「[Todoアイテムの追加を実装する][]」をモデルとイベントの仕組みを使うようにリファクタリングしました。
コード量は増えましたが、次に実装する「Todoアイテムの更新」や「Todoアイテムの削除」も同様の仕組みで実装できます。
前回のセクションのように操作に対してDOMを直接更新した場合、追加は簡単ですが既存の要素を指定する必要がある更新や削除は難しくなります。

次のセクションでは、残りの機能である「Todoアイテムの更新」や「Todoアイテムの削除」を実装していきます。

## このセクションのチェックリスト {#section-checklist}

- 直接DOMを更新する問題について理解した
- `EventEmitter`クラスでイベントの仕組みを実装した
- TodoリストとTodoアイテムをモデルとして実装した
- `TodoListModel`を`EventEmitter`クラスを継承して実装した
- Todoアイテムの追加の機能をモデルを使ってリファクタリングした

ここまでのTodoアプリは次のURLで確認できます。

- <https://jsprimer.net/use-case/todoapp/event-model/event-emitter/>

[Todoアイテムの追加を実装する]: ../form-event/README.md
