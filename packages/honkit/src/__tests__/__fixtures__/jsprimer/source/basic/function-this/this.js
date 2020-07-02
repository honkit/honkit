function getThis() {
    if (isArrowFunction()) {
        return "一つ外側の関数またはグローバルオブジェクト";
    } else if (isGlobalFunction()) {
        if (isLexicalScope()) {
            return undefined;
        } else {
            return "global";
        }
    } else { // function
        return "その関数が所属していたオブジェクト";
    }
}
