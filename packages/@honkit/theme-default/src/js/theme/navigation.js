const dom = require("./dom");
const loading = require("./loading");
const platform = require("./platform");

const gitbook = window.gitbook;

const usePushState = typeof history.pushState !== "undefined";

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
    const scroller = getScroller();
    if (!scroller || !hash || hash.charAt(0) !== "#" || hash.length < 2) {
        return null;
    }
    let id = hash.slice(1);
    try {
        id = decodeURIComponent(id);
    } catch {
        // Malformed escape sequence: use the hash as is
    }
    const element = document.getElementById(id);
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
let scrollAnimation = null;
function animateScrollTop(scroller, dest, duration, done) {
    if (scrollAnimation) {
        cancelAnimationFrame(scrollAnimation);
        scrollAnimation = null;
    }
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = scroller.scrollTop;
    if (reduceMotion || duration <= 0 || start === dest) {
        scroller.scrollTop = dest;
        done();
        return;
    }
    let startTime = null;
    function step(time) {
        if (startTime === null) startTime = time;
        const progress = Math.min(1, (time - startTime) / duration);
        const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
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
    const scroller = getScroller();
    let dest = 0;

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
    const scroller = getScroller();
    const container = scroller ? scroller.querySelector(".page-inner") : null;
    const element = findHashTarget(hash);

    // Exit early if we can't find any of those elements
    if (!scroller || !container || !element) {
        return 0;
    }

    const containerStyle = window.getComputedStyle(container);
    const elementStyle = window.getComputedStyle(element);
    const dest =
        element.getBoundingClientRect().top -
        (parseFloat(elementStyle.marginTop) || 0) -
        (container.getBoundingClientRect().top + (parseFloat(containerStyle.borderTopWidth) || 0));

    // Return rounded value since scrollTop is compared with integers
    return Math.floor(dest);
}

/*
    Handle updating summary at scrolling
*/
let chapters = [],
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

    const oldUri = window.location.pathname + window.location.hash,
        uri = window.location.pathname + hash;

    if (uri != oldUri) {
        history.replaceState({ path: uri }, null, uri);
    }
}

// Return the link that is a direct child of a chapter
function getChapterLink(chapter) {
    for (let i = 0; i < chapter.children.length; i++) {
        if (chapter.children[i].tagName === "A") return chapter.children[i];
    }
    return null;
}

// Return the hash of link for a chapter
function getChapterHash(chapter) {
    const link = getChapterLink(chapter);
    const href = link ? link.getAttribute("href") : null;
    let hash = href ? href.split("#")[1] : null;

    if (hash) hash = "#" + hash;
    return hash || "";
}

// Handle user scrolling
function handleScrolling() {
    if (chapters.length === 0) {
        return;
    }

    // Get current page scroll
    const scroller = getScroller();
    const scrollTop = scroller.scrollTop;
    const scrollHeight = scroller.scrollHeight;
    const clientHeight = scroller.clientHeight;
    const nbChapters = chapters.length;
    let chapter = null;

    // Find each title position in reverse order
    chapters
        .slice()
        .reverse()
        .forEach(function (item, index) {
            const titleId = getChapterHash(item);
            let titleTop;

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

let boundScroller = null;
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
    The page content has the page context as a JSON data block (or, in older layouts,
    an inline script that calls `gitbook.page.hasChanged()`).
*/
function runScripts(container) {
    const scripts = Array.prototype.slice.call(container.querySelectorAll("script"));
    return scripts.reduce(function (previous, oldScript) {
        return previous.then(function () {
            return runScript(oldScript);
        });
    }, Promise.resolve());
}

function runScript(oldScript) {
    // The page context of the new page (see _layouts/website/page.html)
    if (oldScript.id === "honkit-page-context") {
        gitbook.page.hasChanged(JSON.parse(oldScript.textContent));
        return;
    }
    const type = oldScript.getAttribute("type");
    if (type && !/^(text|application)\/(javascript|ecmascript)$|^module$/i.test(type)) {
        return;
    }
    // Browsers that support modules skip `nomodule` scripts without firing load or error
    if (oldScript.hasAttribute("nomodule") && "noModule" in HTMLScriptElement.prototype) {
        return;
    }
    const newScript = document.createElement("script");
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
let prevUri = location.href;

/*
    Remember the scroll position of the current history entry,
    so that going back to it restores the position
    https://github.com/honkit/honkit/issues/339
*/
function saveScrollPosition() {
    const scroller = getScroller();
    if (!scroller) return;
    const state = history.state && typeof history.state === "object" ? history.state : {};
    const newState = {};
    Object.keys(state).forEach(function (key) {
        newState[key] = state[key];
    });
    newState.path = state.path || location.href;
    newState.scrollTop = scroller.scrollTop;
    history.replaceState(newState, "");
}

function isSearchOpen() {
    // The search plugin shows its results in place of the page content
    return document.body.classList.contains("with-search");
}

function restoreScrollTop(scrollTop) {
    const scroller = getScroller();
    if (scroller) scroller.scrollTop = scrollTop;
}

function handleNavigation(relativeUrl, push, scrollTop) {
    const prevUriParsed = new URL(prevUri, location.href);
    const uriParsed = new URL(relativeUrl, location.href);
    const uri = uriParsed.pathname + uriParsed.search + uriParsed.hash;
    const hash = uriParsed.hash;

    // Is it the same url (just hash changed?)
    const pathHasChanged = uriParsed.pathname !== prevUriParsed.pathname;

    // Is it an absolute url (with a scheme or "//")? Load it normally, even on the same origin,
    // because it can be another book that needs its own scripts and styles.
    const isAbsolute = /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(relativeUrl) || uriParsed.origin !== location.origin;

    if (!usePushState || isAbsolute) {
        // Refresh the page to the new URL if pushState not supported
        location.href = relativeUrl;
        return;
    }

    const hasScrollTop = typeof scrollTop === "number";

    if (push) {
        saveScrollPosition();
    }

    // Don't fetch same page, except when a link to the page itself is clicked or the search results are shown:
    // the page content is loaded again to show it
    // https://github.com/honkit/honkit/issues/488
    if (!pathHasChanged && (hash || !push) && !isSearchOpen()) {
        if (push) history.pushState({ path: uri }, null, uri);
        if (hasScrollTop) {
            return restoreScrollTop(scrollTop);
        }
        return scrollToHash(hash);
    }

    prevUri = uri;

    const promise = fetch(uriParsed.pathname + uriParsed.search, {
        // Revalidate so that using the back button shows the latest page
        cache: "no-cache",
        credentials: "same-origin"
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Failed to load " + uri + ": " + response.status);
            }
            // For GitBook.com, we handle redirection signaled by the server
            const responseURL = response.headers.get("X-Current-Location") || uri;
            return response.text().then(function (html) {
                return { html: html, responseURL: responseURL };
            });
        })
        .then(function (result) {
            const newDocument = new DOMParser().parseFromString(result.html, "text/html");
            const pageBody = newDocument.querySelector(".book");

            // We only use history.pushState for pages generated with HonKit
            if (!pageBody) {
                throw new Error("Invalid gitbook page, redirecting...");
            }

            // Each language can have its own plugin styles and scripts outside .book.
            // A body-only swap would keep the resources of the previous language active.
            const pageContext = newDocument.getElementById("honkit-page-context");
            if (pageContext) {
                const context = JSON.parse(pageContext.textContent);
                const language = (context.book && context.book.language) || "";
                if (language !== gitbook.state.innerLanguage) {
                    const destination = new URL(result.responseURL, location.href);
                    // Preview servers receive no fragment in the request URL.
                    // Keep the clicked heading unless the destination specifies one.
                    if (!destination.hash && hash) {
                        destination.hash = hash;
                    }
                    location.href = destination.href;
                    return;
                }
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
            const currentBook = document.querySelector(".book");
            const bodyClass = currentBook.getAttribute("class");
            const currentSummary = document.querySelector(".book-summary");
            const scrollPosition = currentSummary ? currentSummary.scrollTop : 0;

            const newBook = document.importNode(pageBody, true);
            newBook.classList.toggle("with-summary", currentBook.classList.contains("with-summary"));

            currentBook.parentNode.replaceChild(newBook, currentBook);
            return runScripts(newBook).then(function () {
                newBook.setAttribute("class", bodyClass);
                const newSummary = document.querySelector(".book-summary");
                if (newSummary) newSummary.scrollTop = scrollPosition;

                // Update state
                gitbook.state.$book = dom.toJQuery(newBook);
                preparePage(!hash && !hasScrollTop, true);

                if (hasScrollTop) {
                    // Back/forward: restore the scroll position of the history entry
                    restoreScrollTop(scrollTop);
                } else if (hash) {
                    // Scroll to hashtag position
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
    const bodyInnerWidth = getWidth(document.querySelector(".body-inner")),
        pageWrapperWidth = getWidth(document.querySelector(".page-wrapper"));
    const next = document.querySelector(".navigation-next");
    if (next) {
        next.style.marginRight = bodyInnerWidth - pageWrapperWidth + "px";
    }

    // Reset scroll to get current scroller
    bindScrolling(getScroller());
}

function preparePage(resetScroll, focusContent) {
    const pageWrapper = document.querySelector(".book-body .body-inner .page-wrapper");

    // Update navigation position
    updateNavigationPosition();

    // Focus on content after moving to another page, so that keyboard and screen reader users start from it.
    // The initial page load does not move the focus: it would take the focus from an embedding page
    // https://github.com/honkit/honkit/issues/367
    if (focusContent && pageWrapper) {
        // use Native focus
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus
        pageWrapper.focus({ preventScroll: true });
    }

    // Get scroller
    const scroller = getScroller();

    // Reset scroll
    if (resetScroll && scroller) {
        scroller.scrollTop = 0;
    }

    // Get current page summary chapters
    chapters = Array.prototype.filter.call(
        document.querySelectorAll(".book-summary .summary .chapter"),
        function (chapter) {
            const link = getChapterLink(chapter);

            // Chapter doesn't have a link
            if (!link) {
                return false;
            }
            const linkHref = link.getAttribute("href");
            const href = linkHref ? linkHref.split("#")[0] : null;
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
    Is the link to a file that is not a HTML page, like "book.pdf"?
    The browser opens such a file by itself.
    https://github.com/honkit/honkit/issues/453
*/
function isLinkToNonPageFile(link) {
    const href = link.getAttribute("href");
    if (!href) return false;
    const pathname = new URL(href, location.href).pathname;
    const fileName = pathname.slice(pathname.lastIndexOf("/") + 1);
    const extensionIndex = fileName.lastIndexOf(".");
    if (extensionIndex <= 0) return false;
    const extension = fileName.slice(extensionIndex + 1).toLowerCase();
    return extension !== "html" && extension !== "htm";
}

/*
    Handle click on a link
*/
function handleLinkClick(e, link) {
    const target = link.getAttribute("target");

    if (isModifiedEvent(e) || !isLeftClickEvent(e) || target || link.hasAttribute("download")) {
        return;
    }

    if (isLinkToNonPageFile(link)) {
        return;
    }

    e.stopPropagation();
    e.preventDefault();

    const url = link.getAttribute("href");
    if (url) handleNavigation(url, true);
}

function goNext() {
    const next = document.querySelector(".navigation-next");
    const url = next ? next.getAttribute("href") : null;
    if (url) handleNavigation(url, true);
}

function goPrev() {
    const prev = document.querySelector(".navigation-prev");
    const url = prev ? prev.getAttribute("href") : null;
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

        return handleNavigation(event.state.path, false, event.state.scrollTop);
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
