/*
    Small DOM helpers used by the theme instead of jQuery.
*/

// Add an event listener on `document` for elements matching `selector` (event delegation)
function delegate(eventName, selector, handler) {
    document.addEventListener(eventName, function (e) {
        const target = e.target instanceof Element ? e.target.closest(selector) : null;
        if (target) {
            handler.call(target, e, target);
        }
    });
}

// Create an element with attributes
function createElement(tagName, attributes) {
    const element = document.createElement(tagName);
    Object.keys(attributes || {}).forEach(function (name) {
        const value = attributes[name];
        if (name === "class") {
            element.className = value;
        } else if (name === "text") {
            element.textContent = value;
        } else if (name === "html") {
            element.innerHTML = value;
        } else {
            element.setAttribute(name, value);
        }
    });
    return element;
}

// Return the jQuery object for an element when jQuery is available.
// `gitbook.state.$book` is a deprecated API that plugins still read.
function toJQuery(element) {
    const $ = window.jQuery;
    return typeof $ === "function" ? $(element) : element;
}

module.exports = {
    delegate: delegate,
    createElement: createElement,
    toJQuery: toJQuery
};
