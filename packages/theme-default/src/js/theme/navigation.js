var $ = require('jquery');
var url = require('url');

var loading = require('./loading');
var platform = require('./platform');

var gitbook = window.gitbook;

var usePushState = (typeof history.pushState !== 'undefined');

/*
    Get current scroller element
*/
function getScroller() {
    if (platform.isMobile()) {
        return $('.book-body');
    } else {
        return $('.body-inner');
    }
}

/*
    Scroll to a specific hash tag in the content
*/
function scrollToHash(hash) {
    var $scroller = getScroller();
    var dest = 0;

    if (hash) {
        dest = $scroller.find(hash).position().top;
    }

    $scroller.animate({
        scrollTop: dest
    }, 800, 'swing');
}

/*
    Handle a change of url withotu refresh the whole page
*/
var prevUri = location.href;
function handleNavigation(relativeUrl, push) {
    var prevUriParsed = url.parse(prevUri);

    var uri = url.resolve(window.location.pathname, relativeUrl);
    var uriParsed = url.parse(uri);
    var hash = uriParsed.hash;

    // Is it the same url (just hash changed?)
    var pathHasChanged = (uriParsed.pathname !== prevUriParsed.pathname);

    // Is it an absolute url
    var isAbsolute = Boolean(uriParsed.hostname);

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

    return loading.show($.get(uri)
    .then(function (html) {
        // Replace html content
        html = html.replace( /<(\/?)(html|head|body)([^>]*)>/ig, function(a,b,c,d){
            return '<' + b + 'div' + ( b ? '' : ' data-element="' + c + '"' ) + d + '>';
        });

        var $page = $(html);
        var $pageHead = $page.find('[data-element=head]');
        var $pageBody = $page.find('.book');

        // We only use history.pushState for pages generated with GitBook
        if ($pageBody.length === 0) {
            return $.Deferred(function (deferred) {
                var err = new Error('Invalid gitbook page, redirecting...');
                deferred.reject(err);
            }).promise();
        }

        // Push url to history
        if (push) {
            history.pushState({
                path: uri
            }, null, uri);
        }

        // Merge heads
        // !! Warning !!: we only update necessary portions to avoid strange behavior (page flickering etc ...)

        // Update title
        document.title = $pageHead.find('title').text();

        // Reference to $('head');
        var $head = $('head');

        // Update next & prev <link> tags
        // Remove old
        $head.find('link[rel=prev]').remove();
        $head.find('link[rel=next]').remove();

        // Add new next * prev <link> tags
        $head.append($pageHead.find('link[rel=prev]'));
        $head.append($pageHead.find('link[rel=next]'));

        // Merge body
        var bodyClass = $('.book').attr('class');
        var scrollPosition = $('.book-summary').scrollTop();

        $pageBody.toggleClass('with-summary', $('.book').hasClass('with-summary'));

        $('.book').replaceWith($pageBody);
        $('.book').attr('class', bodyClass);
        $('.book-summary').scrollTop(scrollPosition);

        // Scroll to hashtag position
        if (hash) {
            scrollToHash(hash);
        }

        // Update state
        gitbook.state.$book = $('.book');
        preparePage(!hash);
    })
    .fail(function (e) {
        location.href = relativeUrl;
    }));
}

function updateNavigationPosition() {
    var bodyInnerWidth, pageWrapperWidth;

    bodyInnerWidth = parseInt($('.body-inner').css('width'), 10);
    pageWrapperWidth = parseInt($('.page-wrapper').css('width'), 10);
    $('.navigation-next').css('margin-right', (bodyInnerWidth - pageWrapperWidth) + 'px');
}

function preparePage(resetScroll) {
    var $bookBody = $('.book-body');
    var $bookInner = $bookBody.find('.body-inner');
    var $pageWrapper = $bookInner.find('.page-wrapper');

    // Update navigation position
    updateNavigationPosition();

    // Focus on content
    $pageWrapper.focus();

    // Reset scroll
    if (resetScroll !== false) $bookInner.scrollTop(0);
    $bookBody.scrollTop(0);
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
function handleLinkClick(e) {
    var $this = $(this);
    var target = $this.attr('target');

    if (isModifiedEvent(e) || !isLeftClickEvent(e) || target) {
        return;
    }

    e.stopPropagation();
    e.preventDefault();

    var url = $this.attr('href');
    if (url) handleNavigation(url, true);
}

function goNext() {
    var url = $('.navigation-next').attr('href');
    if (url) handleNavigation(url, true);
}

function goPrev() {
    var url = $('.navigation-prev').attr('href');
    if (url) handleNavigation(url, true);
}


function init() {
    // Prevent cache so that using the back button works
    // See: http://stackoverflow.com/a/15805399/983070
    $.ajaxSetup({
        cache: false
    });

    // Recreate first page when the page loads.
    history.replaceState({ path: window.location.href }, '');

    // Back Button Hijacking :(
    window.onpopstate = function (event) {
        if (event.state === null) {
            return;
        }

        return handleNavigation(event.state.path, false);
    };

    $(document).on('click', '.navigation-prev', handleLinkClick);
    $(document).on('click', '.navigation-next', handleLinkClick);
    $(document).on('click', '.summary [data-path] a', handleLinkClick);
    $(document).on('click', '.page-inner a', handleLinkClick);

    $(window).resize(updateNavigationPosition);

    // Prepare current page
    preparePage();
}

module.exports = {
    init: init,
    goNext: goNext,
    goPrev: goPrev
};
