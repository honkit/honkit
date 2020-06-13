/**
 * 指定時間内にタイマーが発火されるなら成功、そうでないなら失敗
 * @param callback
 */
const asyncDo = (callback) => {
    // タイマーのコールバックを呼び出すまでの時間（ミリ秒）
    const delay = 10;
    // タイマーのコールバックが呼ばれるまで待てる時間（ミリ秒）
    const limitOfDelay = delay * 2;
    const startTime = Date.now();
    setTimeout(() => {
        const diffTime = Date.now() - startTime;
        if (diffTime <= limitOfDelay) {
            callback(null, `許容時間内にタイマーが発火しました（${diffTime}ミリ秒）`);
        } else {
            callback(new Error(`許容時間内タイマーが発火できませんでした（${diffTime}ミリ秒）`));
        }
    }, delay);
};

const doTask = () => {
    const newArray = new Array(10e6).fill(0);
    console.log(`${newArray.length}コの配列を0で初期化しました`);
};

asyncDo((error, message) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(message);
    asyncDo((error, message) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(message);
    });

    doTask();
});


