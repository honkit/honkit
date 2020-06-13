class MyClass {
    method() {
        console.log("プロトタイプオブジェクト");
    }
}

// インスタンス を クラス から作る
const myInstance = new MyClass();

// 再帰表現
function call(obj, methodName) {
    if (obj.hasOwnProperty(methodName)) {
        return obj[methodName]();
    }
    const prototypeObject = Object.getPrototypeOf(obj);
    if (!prototypeObject) {
        return;
    }
    return call(prototypeObject, methodName);
}

call(myInstance, "method");
