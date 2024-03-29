// Return N time a string
function ns(s: string, n: number) {
    return Array(n + 1).join(s);
}

export default {
    onTitleStart: function (level) {
        return `${ns("=", level)} `;
    },
    onTitleEnd: function (level) {
        return this.onBL();
    },

    onParagraphStart: function () {
        return this.onSection();
    },
    onParagraphEnd: function () {
        return this.onSection();
    },

    onLinkStart: function (href) {
        return `link:${href}[`;
    },
    onLinkEnd: function () {
        return "]";
    },

    onListStart: function (level) {
        return "";
    },
    onListEnd: function () {
        return "";
    },

    onListItemStart: function (level) {
        return `${ns(".", level + 1)} `;
    },
    onListItemEnd: function () {
        return "";
    },

    onHR: function () {
        return "'''";
    }
};
