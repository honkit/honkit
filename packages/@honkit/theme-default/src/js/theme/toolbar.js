var dom = require("./dom");

var gitbook = window.gitbook;

// List of created buttons
var buttons = [],
    // Generated Id for buttons
    BTN_ID = 0;

function generateId() {
    return "btn-" + BTN_ID++;
}

function isNumeric(value) {
    return (typeof value === "number" || typeof value === "string") && value !== "" && isFinite(value);
}

function matchingChildren(parent, selector) {
    return Array.prototype.filter.call(parent.children, function (child) {
        return child.matches(selector);
    });
}

// Insert an element at a specific position
function insertAt(parent, selector, index, element) {
    var lastIndex = matchingChildren(parent, selector).length;
    if (index < 0) {
        index = Math.max(0, lastIndex + 1 + index);
    }
    parent.appendChild(element);

    if (index < lastIndex) {
        var children = matchingChildren(parent, selector);
        parent.insertBefore(children[children.length - 1], children[index]);
    }
}

// Default click handler
function defaultOnClick(e) {
    e.preventDefault();
}

function assign(defaults, opts) {
    var result = {};
    Object.keys(defaults).forEach(function (key) {
        result[key] = defaults[key];
    });
    Object.keys(opts || {}).forEach(function (key) {
        if (opts[key] !== undefined) result[key] = opts[key];
    });
    return result;
}

// Create a dropdown menu
function createDropdownMenu(dropdown) {
    var menu = dom.createElement("div", {
        class: "dropdown-menu",
        html: '<div class="dropdown-caret"><span class="caret-outer"></span><span class="caret-inner"></span></div>'
    });

    if (typeof dropdown == "string") {
        menu.insertAdjacentHTML("beforeend", dropdown);
    } else {
        var groups = dropdown.map(function (group) {
            if (Array.isArray(group)) return group;
            else return [group];
        });

        // Create buttons groups
        groups.forEach(function (group) {
            var groupElement = dom.createElement("div", {
                class: "buttons"
            });
            var sizeClass = "size-" + group.length;

            // Append buttons
            group.forEach(function (btn) {
                btn = assign(
                    {
                        text: "",
                        className: "",
                        onClick: defaultOnClick
                    },
                    btn
                );

                var btnElement = dom.createElement("button", {
                    class: "button " + sizeClass + " " + btn.className,
                    text: btn.text
                });
                btnElement.addEventListener("click", btn.onClick);

                groupElement.appendChild(btnElement);
            });

            menu.appendChild(groupElement);
        });
    }

    return menu;
}

// Create a new button in the toolbar
function createButton(opts) {
    opts = assign(
        {
            // Aria label for the button
            label: "",

            // Icon to show
            icon: "",

            // Inner text
            text: "",

            // Right or left position
            position: "left",

            // Other class name to add to the button
            className: "",

            // Triggered when user click on the button
            onClick: defaultOnClick,

            // Button is a dropdown
            dropdown: null,

            // Position in the toolbar
            index: null,

            // Button id for removal
            id: generateId()
        },
        opts
    );

    buttons.push(opts);
    updateButton(opts);

    return opts.id;
}

function addClasses(element, classNames) {
    String(classNames || "")
        .split(/\s+/)
        .filter(Boolean)
        .forEach(function (className) {
            element.classList.add(className);
        });
}

// Update a button
function updateButton(opts) {
    var result;
    var toolbar = document.querySelector(".book-header");
    if (!toolbar) return;
    var title = toolbar.querySelector("h1");

    // Build class name
    var positionClass = "pull-" + opts.position;

    // Create button
    var btn = dom.createElement("a", {
        class: "btn",
        text: opts.text ? " " + opts.text : "",
        "aria-label": opts.label,
        href: "#"
    });

    // Bind click
    btn.addEventListener("click", opts.onClick);

    // Prepend icon
    if (opts.icon) {
        btn.insertBefore(dom.createElement("i", { class: opts.icon }), btn.firstChild);
    }

    // Prepare dropdown
    if (opts.dropdown) {
        var container = dom.createElement("div", {
            class: "dropdown " + positionClass + " " + opts.className
        });

        // Add button to container
        btn.classList.add("toggle-dropdown");
        container.appendChild(btn);

        // Create inner menu
        var menu = createDropdownMenu(opts.dropdown);

        // Menu position
        menu.classList.add("dropdown-" + (opts.position == "right" ? "left" : "right"));

        container.appendChild(menu);
        result = container;
    } else {
        btn.classList.add(positionClass);
        addClasses(btn, opts.className);
        result = btn;
    }

    result.classList.add("js-toolbar-action");

    if (isNumeric(opts.index) && opts.index >= 0) {
        insertAt(toolbar, ".btn, .dropdown, h1", Number(opts.index), result);
    } else if (title) {
        toolbar.insertBefore(result, title);
    } else {
        toolbar.appendChild(result);
    }
}

// Update all buttons
function updateAllButtons() {
    document.querySelectorAll(".js-toolbar-action").forEach(function (element) {
        element.remove();
    });
    buttons.forEach(updateButton);
}

// Remove a button provided its id
function removeButton(id) {
    buttons = buttons.filter(function (button) {
        return button.id != id;
    });

    updateAllButtons();
}

// Remove multiple buttons from an array of ids
function removeButtons(ids) {
    buttons = buttons.filter(function (button) {
        return ids.indexOf(button.id) == -1;
    });

    updateAllButtons();
}

// When page changed, reset buttons
gitbook.events.on("page.change", function () {
    updateAllButtons();
});

module.exports = {
    createButton: createButton,
    removeButton: removeButton,
    removeButtons: removeButtons
};
