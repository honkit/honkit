/**
 * `delay * 1.5`ミリ秒以内にタイマーが呼ばれたら成功、呼ばれなかったら失敗とする関数
 * @param {Function} callback 
 * @param {number} delay タイマーのコールバックを呼び出すまでの時間（ミリ秒）
 */
const exactSetTimeout = (callback, delay) => {
    // `delay`に指定された時間の1.5倍まで許容する
    const limitOfDelay = delay * 1.5;
    const startTime = Date.now();
    setTimeout(() => {
        const diffTime = Date.now() - startTime;
        if (diffTime <= limitOfDelay) {
            callback(null, `許容時間内にタイマーが呼ばれました${diffTime}ミリ秒）`);
        } else {
            callback(new Error(`許容時間内にタイマーが呼ばれませんでした${diffTime}ミリ秒）`));
        }
    }, delay);
};

exactSetTimeout((error, message) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(message);
}, 10);


/**
 * `task`を実行して、成功なら、`callback(null, タスクの返り値)`と呼び出す
 * 失敗なら、`callback(error)`と呼び出す
 * @param {Function} task 
 * @param {(error: null|Error, result: *)} callback 
 */
function callTaskAsync(task, callback) {
    setTimeout(() => {
        try {
            const result = task();
            callback(null, result);
        } catch (error) {
            callback(error);
        }
    }, 10);
}

const successTask = () => {
    return "成功！";
};
const failtureTask = () => {
    throw new Error("タスクが失敗しました");
};

callTaskAsync(successTask, (error, result) => {
    if (error) {
        console.error(error); // タスクが失敗した場合
    } else {
        console.log(result); // タスクが成功した場合
    }
});
