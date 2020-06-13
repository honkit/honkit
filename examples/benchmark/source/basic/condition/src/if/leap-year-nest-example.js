const year = new Date().getFullYear();
if (year % 4 === 0) { // 4で割り切れる
    if (year % 100 === 0) { // 100で割り切れる
        if (year % 400 === 0) { // 400で割り切れる
            console.log(`${year}年はうるう年です`);
        } else {
            console.log(`${year}年はうるう年ではありません`);
        }
    } else {
        console.log(`${year}年はうるう年です`);
    }
} else {
    console.log(`${year}年はうるう年ではありません`);
}