class ConflictClass {
    constructor() {
        this.method = () => {
            console.log("インスタンスのメソッド");
        };
    }

    method() {
        console.log("プロトタイプメソッド");
    }
}

const conflict = new ConflictClass();
conflict.method(); // "インスタンスのメソッド"
// インスタンスの`method`プロパティを削除
delete conflict.method;
// プロトタイプメソッドの`method`が呼ばれるようになる
conflict.method(); // "プロトタイプメソッド"
