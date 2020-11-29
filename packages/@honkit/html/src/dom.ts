import _ from "lodash";
import cheerio from "cheerio";

/**
    Parse an HTML string and return its content

    @param {string}
    @return {cheerio.DOM}
*/
export function parse(html: string) {
    const $ = cheerio.load(html);
    const $el = $("html, body").first();

    return $el.length > 0 ? $el : $;
}

/**
    Return main element for a DOM

    @param {cheerio.DOM}
    @return {cheerio.Node}
*/
export function root($) {
    const $el = $("html, body, > div").first();
    return $el.length > 0 ? $el : $.root();
}

/**
    Return text node of an element

    @param {cheerio.Node}
    @return {string}
*/
export function textNode($el) {
    return _.reduce(
        $el.children,
        (text, e) => {
            if (e.type == "text") text += e.data;
            return text;
        },
        ""
    );
}

/**
    Cleanup a DOM by removing all useless divs

    @param {cheerio.Node}
    @param {cheerio.DOM}
    @return {cheerio.Node}
*/
export function cleanup($el, $) {
    $el.find("div").each(function () {
        const $div = $(this);
        cleanup($div, $);

        $div.replaceWith($div.html());
    });

    return $el;
}
