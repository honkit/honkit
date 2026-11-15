function getBook() {
    return document.querySelector(".book");
}

// Show the loading state while the promise is pending
function showLoading(p) {
    const book = getBook();
    if (book) book.classList.add("is-loading");
    const done = function () {
        const current = getBook();
        if (current) current.classList.remove("is-loading");
    };
    p.then(done, done);
    return p;
}

module.exports = {
    show: showLoading
};
