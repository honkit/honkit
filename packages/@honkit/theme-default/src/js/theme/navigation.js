var dom = require("./dom");
var loading = require("./loading");
var platform = require("./platform");

var gitbook = window.gitbook;

var usePushState = typeof history.pushState !== "undefined";

/*
    Get current scroller element
*/
function getScroller() {
    if (platform.isSmallScreen()) {
        return document.querySelector(".book-body");
    } else {
        return document.querySelector(".body-inner");
    }
}

/*
    Return the element targeted by a hash ("#id") inside the scroller
*/
function findHashTarget(hash) {
    var scroller = getScroller();
    if (!scroller || !hash || hash.charAt(0) !== "#" || hash.length < 2) {
        return null;
    }
    var id = hash.slice(1);
    try {
        id = decodeURIComponent(id);
    } catch (e) {} // eslint-disable-line no-empty, no-unused-vars
    var element = document.getElementById(id);
    return element && scroller.contains(element) ? element : null;
}

/*
    Return wether the element exists on the page
 */
function pageHasElement(hash) {
    return Boolean(findHashTarget(hash));
}

/*
    Scroll the scroller with the same easing as jQuery's "swing"
*/
var scrollAnimation = null;
function animateScrollTop(scroller, dest, duration, done) {
    if (scrollAnimation) {
        cancelAnimationFrame(scrollAnimation);
        scrollAnimation = null;
    }
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var start = scroller.scrollTop;
    if (reduceMotion || duration <= 0 || start === dest) {
        scroller.scrollTop = dest;
        done();
        return;
    }
    var startTime = null;
    function step(time) {
        if (startTime === null) startTime = time;
        var progress = Math.min(1, (time - startTime) / duration);
        var eased = 0.5 - Math.cos(progress * Math.PI) / 2;
        scroller.scrollTop = start + (dest - start) * eased;
        if (progress < 1) {
            scrollAnimation = requestAnimationFrame(step);
        } else {
            scrollAnimation = null;
            done();
        }
    }
    scrollAnimation = requestAnimationFrame(step);
}

/*
    Scroll to a specific hash tag in the content
*/
function scrollToHash(hash) {
    var scroller = getScroller(),
        dest = 0;

    // Don't try to scroll if element doesn't exist
    if (!pageHasElement(hash)) {
        return;
    }

    if (hash) {
        dest = getElementTopPosition(hash);
    }

    // Unbind scroll detection
    unbindScrolling();
    animateScrollTop(scroller, dest, 800, function () {
        // Reset scroll binding when finished
        bindScrolling(getScroller());
    });

    // Directly set chapter as active
    setChapterActive(null, hash);
}

/*
    Return the top position of an element, relative to the content (.page-inner)
 */
function getElementTopPosition(hash) {
    var scroller = getScroller();
    var container = scroller ? scroller.querySelector(".page-inner") : null;
    var element = findHashTarget(hash);

    // Exit early if we can't find any of those elements
    if (!scroller || !container || !element) {
        return 0;
    }

    var containerStyle = window.getComputedStyle(container);
    var elementStyle = window.getComputedStyle(element);
    var dest =
        element.getBoundingClientRect().top -
        (parseFloat(elementStyle.marginTop) || 0) -
        (container.getBoundingClientRect().top + (parseFloat(containerStyle.borderTopWidth) || 0));

    // Return rounded value since scrollTop is compared with integers
    return Math.floor(dest);
}

/*
    Handle updating summary at scrolling
*/
var chapters = [],
    activeChapter = null;

// Set a chapter as active in summary and update state
function setChapterActive(chapter, hash) {
    // No chapter and no hash means first chapter
    if (!chapter && !hash) {
        chapter = chapters[0] || null;
    }

    // If hash is provided, set as active chapter
    if (hash) {
        // Multiple chapters for this file
        if (chapters.length > 1) {
            chapter =
                chapters.filter(function (item) {
                    return getChapterHash(item) == hash;
                })[0] || null;
        }
        // Only one chapter, no need to search
        else {
            chapter = chapters[0] || null;
        }
    }

    // Don't update current chapter
    if (!chapter || chapter === activeChapter) {
        return;
    }

    // Update current active chapter
    activeChapter = chapter;

    // Add class to selected chapter
    chapters.forEach(function (item) {
        item.classList.remove("active");
    });
    chapter.classList.add("active");

    // Update history state if needed
    hash = getChapterHash(chapter);

    var oldUri = window.location.pathname + window.location.hash,
        uri = window.location.pathname + hash;

    if (uri != oldUri) {
        history.replaceState({ path: uri }, null, uri);
    }
}

// Return the link that is a direct child of a chapter
function getChapterLink(chapter) {
    for (var i = 0; i < chapter.children.length; i++) {
        if (chapter.children[i].tagName === "A") return chapter.children[i];
    }
    return null;
}

// Return the hash of link for a chapter
function getChapterHash(chapter) {
    var link = getChapterLink(chapter),
        href = link ? link.getAttribute("href") : null,
        hash = href ? href.split("#")[1] : null;

    if (hash) hash = "#" + hash;
    return hash || "";
}

// Handle user scrolling
function handleScrolling() {
    if (chapters.length === 0) {
        return;
    }

    // Get current page scroll
    var scroller = getScroller(),
        scrollTop = scroller.scrollTop,
        scrollHeight = scroller.scrollHeight,
        clientHeight = scroller.clientHeight,
        nbChapters = chapters.length,
        chapter = null;

    // Find each title position in reverse order
    chapters
        .slice()
        .reverse()
        .forEach(function (item, index) {
            var titleId = getChapterHash(item),
                titleTop;

            if (!!titleId && !chapter) {
                titleTop = getElementTopPosition(titleId);

                // Set current chapter as active if scroller passed it
                if (scrollTop >= titleTop) {
                    chapter = item;
                }
            }
            // If no active chapter when reaching first chapter, set it as active
            if (index == nbChapters - 1 && !chapter) {
                chapter = item;
            }
        });

    // ScrollTop is at 0, set first chapter anyway
    if (!chapter && !scrollTop) {
        chapter = chapters[0];
    }

    // Set last chapter as active if scrolled to bottom of page
    if (!!scrollTop && Math.abs(scrollHeight - scrollTop - clientHeight) < 1) {
        chapter = chapters[chapters.length - 1];
    }

    setChapterActive(chapter);
}

var boundScroller = null;
function unbindScrolling() {
    if (boundScroller) {
        boundScroller.removeEventListener("scroll", handleScrolling);
        boundScroller = null;
    }
}
function bindScrolling(scroller) {
    unbindScrolling();
    if (scroller) {
        scroller.addEventListener("scroll", handleScrolling);
        boundScroller = scroller;
    }
}

/*
    Run the scripts of inserted content in document order, like jQuery's DOM insertion did.
    An external script is loaded before the scripts after it run,
    so an inline script can use what a preceding external script defines.
    The page content contains an inline script that calls `gitbook.page.hasChanged()`.
*/
function runScripts(container) {
    var scripts = Array.prototype.slice.call(container.querySelectorAll("script"));
    return scripts.reduce(function (previous, oldScript) {
        return previous.then(function () {
            return runScript(oldScript);
        });
    }, Promise.resolve());
}

function runScript(oldScript) {
    var type = oldScript.getAttribute("type");
    if (type && !/^(text|application)\/(javascript|ecmascript)$|^module$/i.test(type)) {
        return;
    }
    var newScript = document.createElement("script");
    Array.prototype.forEach.call(oldScript.attributes, function (attribute) {
        newScript.setAttribute(attribute.name, attribute.value);
    });
    if (!oldScript.src) {
        // An inline script runs when it is inserted
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
        return;
    }
    return new Promise(function (resolve) {
        newScript.async = false;
        // Continue with the next scripts even if this one fails to load
        newScript.addEventListener("load", resolve);
        newScript.addEventListener("error", resolve);
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

/*
    Handle a change of url withotu refresh the whole page
*/
var prevUri = location.href;

function handleNavigation(relativeUrl, push) {
    var prevUriParsed = new URL(prevUri, location.href);
    var uriParsed = new URL(relativeUrl, location.href);
    var uri = uriParsed.pathname + uriParsed.search + uriParsed.hash;
    var hash = uriParsed.hash;

    // Is it the same url (just hash changed?)
    var pathHasChanged = uriParsed.pathname !== prevUriParsed.pathname;

    // Is it an absolute url (with a scheme or "//")? Load it normally, even on the same origin,
    // because it can be another book that needs its own scripts and styles.
    var isAbsolute = /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(relativeUrl) || uriParsed.origin !== location.origin;

    if (!usePushState || isAbsolute) {
        // Refresh the page to the new URL if pushState not supported
        location.href = relativeUrl;
        return;
    }

    // Don't fetch same page
    if (!pathHasChanged) {
        if (push) history.pushState({ path: uri }, null, uri);
        return scrollToHash(hash);
    }

    prevUri = uri;

    var promise = fetch(uriParsed.pathname + uriParsed.search, {
        // Revalidate so that using the back button shows the latest page
        cache: "no-cache",
        credentials: "same-origin"
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Failed to load " + uri + ": " + response.status);
            }
            // For GitBook.com, we handle redirection signaled by the server
            var responseURL = response.headers.get("X-Current-Location") || uri;
            return response.text().then(function (html) {
                return { html: html, responseURL: responseURL };
            });
        })
        .then(function (result) {
            var newDocument = new DOMParser().parseFromString(result.html, "text/html");
            var pageBody = newDocument.querySelector(".book");

            // We only use history.pushState for pages generated with HonKit
            if (!pageBody) {
                throw new Error("Invalid gitbook page, redirecting...");
            }

            // Push url to history
            if (push) {
                history.pushState(
                    {
                        path: result.responseURL
                    },
                    null,
                    result.responseURL
                );
            }

            // Merge heads
            // !! Warning !!: we only update necessary portions to avoid strange behavior (page flickering etc ...)

            // Update title
            document.title = newDocument.title;

            // Update next & prev <link> tags
            document.head.querySelectorAll("link[rel=prev], link[rel=next]").forEach(function (link) {
                link.remove();
            });
            newDocument.head.querySelectorAll("link[rel=prev], link[rel=next]").forEach(function (link) {
                document.head.appendChild(document.importNode(link, true));
            });

            // Merge body
            var currentBook = document.querySelector(".book");
            var bodyClass = currentBook.getAttribute("class");
            var currentSummary = document.querySelector(".book-summary");
            var scrollPosition = currentSummary ? currentSummary.scrollTop : 0;

            var newBook = document.importNode(pageBody, true);
            newBook.classList.toggle("with-summary", currentBook.classList.contains("with-summary"));

            currentBook.parentNode.replaceChild(newBook, currentBook);
            return runScripts(newBook).then(function () {
                newBook.setAttribute("class", bodyClass);
                var newSummary = document.querySelector(".book-summary");
                if (newSummary) newSummary.scrollTop = scrollPosition;

                // Update state
                gitbook.state.$book = dom.toJQuery(newBook);
                preparePage(!hash);

                // Scroll to hashtag position
                if (hash) {
                    scrollToHash(hash);
                }
            });
        });

    return loading.show(
        promise.catch(function (e) {
            console.log(e);
            // Fall back to a normal page load
            location.href = uriParsed.href;
        })
    );
}

function getWidth(element) {
    return element ? parseInt(window.getComputedStyle(element).width, 10) || 0 : 0;
}

function updateNavigationPosition() {
    var bodyInnerWidth = getWidth(document.querySelector(".body-inner")),
        pageWrapperWidth = getWidth(document.querySelector(".page-wrapper"));
    var next = document.querySelector(".navigation-next");
    if (next) {
        next.style.marginRight = bodyInnerWidth - pageWrapperWidth + "px";
    }

    // Reset scroll to get current scroller
    bindScrolling(getScroller());
}

function preparePage(resetScroll) {
    var pageWrapper = document.querySelector(".book-body .body-inner .page-wrapper");

    // Update navigation position
    updateNavigationPosition();

    // Focus on content
    if (pageWrapper) {
        // use Native focus
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus
        pageWrapper.focus({ preventScroll: true });
    }

    // Get scroller
    var scroller = getScroller();

    // Reset scroll
    if (resetScroll && scroller) {
        scroller.scrollTop = 0;
    }

    // Get current page summary chapters
    chapters = Array.prototype.filter.call(
        document.querySelectorAll(".book-summary .summary .chapter"),
        function (chapter) {
            var link = getChapterLink(chapter);

            // Chapter doesn't have a link
            if (!link) {
                return false;
            }
            var linkHref = link.getAttribute("href");
            var href = linkHref ? linkHref.split("#")[0] : null;
            if (!href) {
                return false;
            }

            return new URL(href, location.href).pathname === window.location.pathname;
        }
    );

    activeChapter = chapters[0] || null;
}

function isLeftClickEvent(e) {
    return e.button === 0;
}

function isModifiedEvent(e) {
    return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}

/*
    Handle click on a link
*/
function handleLinkClick(e, link) {
    var target = link.getAttribute("target");

    if (isModifiedEvent(e) || !isLeftClickEvent(e) || target) {
        return;
    }

    e.stopPropagation();
    e.preventDefault();

    var url = link.getAttribute("href");
    if (url) handleNavigation(url, true);
}

function goNext() {
    var next = document.querySelector(".navigation-next");
    var url = next ? next.getAttribute("href") : null;
    if (url) handleNavigation(url, true);
}

function goPrev() {
    var prev = document.querySelector(".navigation-prev");
    var url = prev ? prev.getAttribute("href") : null;
    if (url) handleNavigation(url, true);
}

function init() {
    // Recreate first page when the page loads.
    history.replaceState({ path: location.pathname + location.search + location.hash }, "");

    // Back Button Hijacking :(
    window.onpopstate = function (event) {
        if (event.state === null) {
            return;
        }

        return handleNavigation(event.state.path, false);
    };

    dom.delegate("click", ".navigation-prev", handleLinkClick);
    dom.delegate("click", ".navigation-next", handleLinkClick);
    dom.delegate("click", ".summary [data-path] a", handleLinkClick);
    dom.delegate("click", ".page-inner a", handleLinkClick);

    window.addEventListener("resize", updateNavigationPosition);

    // Prepare current page
    preparePage(false);
}

module.exports = {
    init: init,
    goNext: goNext,
    goPrev: goPrev
};
