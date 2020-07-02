class EventEmitter {
    constructor() {
        // 登録済みのイベントリスナーの状態
        this.eventHandlers = [];
    }

    // `handler`(コールバック関数)を登録する
    addEventListener(handler) {
        this.eventHandlers.push(handler);
    }

    // 登録済みのイベントリスナーーに対して引数`...args`を渡して呼び出す
    emit(...args) {
        this.eventHandlers.forEach(handler => {
            handler(...args);
        });
    }
}

class ObservableValue extends EventEmitter {
    constructor(...args) {
        super(...args);
    }

    onChange(onChangeHandler) {
        this.addEventListener(onChangeHandler);
    }

    get value() {
        return this._value;
    }

    set value(newValue) {
        const prevValue = this._value;
        if (prevValue === newValue) {
            return;
        }
        this._value = newValue;
        this.emit(prevValue, newValue);
    }
}


const observable = new ObservableValue();
observable.onChange((prevValue, newValue) => {
    console.log(prevValue); // => undefined
    console.log(newValue); // => 2
});
// 新しい値変更する
observable.value = 2;
console.log(observable.value); // => 2
