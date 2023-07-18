import * as navigation from "./navigation";

function bindShortCuts(shortcuts, target = window) {
    target.addEventListener(
        "keydown",
        (e) => {
            if (!(e instanceof KeyboardEvent)) {
                return;
            }
            const key = e.key;
            if (key in shortcuts) {
                shortcuts[key]();
            }
        },
        {
            passive: true
        }
    );
}

// Bind keyboard shortcuts
export function initKeyBoard() {
    bindShortCuts({
        ArrowRight: () => navigation.goNext(),
        ArrowLeft: () => navigation.goPrev()
    });
}
