const navigation = require("./navigation");
const sidebar = require("./sidebar");

/*
    Minimal keyboard shortcut handling, compatible with the subset of
    Mousetrap that HonKit used: single keys such as "right", "left", "s",
    and modifier combinations such as "ctrl+k" or "mod+k".
*/
const KEY_ALIASES = {
    left: "arrowleft",
    right: "arrowright",
    up: "arrowup",
    down: "arrowdown",
    esc: "escape",
    space: " ",
    return: "enter",
    del: "delete",
    plus: "+"
};
const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const bindings = [];

function parseCombo(combo) {
    const parts = combo.toLowerCase().split("+");
    let key = parts.pop();
    if (key === "") {
        key = "+";
        parts.pop();
    }
    const modifiers = { ctrl: false, alt: false, shift: false, meta: false };
    parts.forEach(function (part) {
        if (part === "mod") {
            modifiers[isMac ? "meta" : "ctrl"] = true;
        } else if (part === "option") {
            modifiers.alt = true;
        } else if (part === "command" || part === "cmd") {
            modifiers.meta = true;
        } else if (part in modifiers) {
            modifiers[part] = true;
        }
    });
    return { key: KEY_ALIASES[key] || key, modifiers: modifiers };
}

// Same rule as Mousetrap: ignore shortcuts while typing in a form field
function isEditableTarget(target) {
    if (!(target instanceof Element)) {
        return false;
    }
    if (target.closest(".mousetrap")) {
        return false;
    }
    return target.matches("input, select, textarea") || target.isContentEditable;
}

function matches(e, combo) {
    const key = (e.key || "").toLowerCase();
    if (key !== combo.key) {
        return false;
    }
    // Shift is part of the character for symbols such as "?" or "+"
    const shiftMatters = combo.key.length > 1 || /[a-z0-9]/.test(combo.key);
    return (
        e.ctrlKey === combo.modifiers.ctrl &&
        e.altKey === combo.modifiers.alt &&
        e.metaKey === combo.modifiers.meta &&
        (!shiftMatters || e.shiftKey === combo.modifiers.shift)
    );
}

function onKeyDown(e) {
    if (isEditableTarget(e.target)) {
        return;
    }
    for (let i = 0; i < bindings.length; i++) {
        const binding = bindings[i];
        if (binding.combos.some(matches.bind(null, e))) {
            // Returning false from a Mousetrap callback prevented the default action
            e.preventDefault();
            e.stopPropagation();
            binding.fn(e);
            return;
        }
    }
}

document.addEventListener("keydown", onKeyDown);

// Bind a keyboard shortcuts
function bindShortcut(keys, fn) {
    const combos = (Array.isArray(keys) ? keys : [keys]).map(parseCombo);
    // The last binding for a key wins, like Mousetrap
    bindings.unshift({ combos: combos, fn: fn });
}

// Bind keyboard shortcuts
function init() {
    // Next
    bindShortcut(["right"], function () {
        navigation.goNext();
    });

    // Prev
    bindShortcut(["left"], function () {
        navigation.goPrev();
    });

    // Toggle Summary
    bindShortcut(["s"], function () {
        sidebar.toggle();
    });
}

module.exports = {
    init: init,
    bind: bindShortcut
};
