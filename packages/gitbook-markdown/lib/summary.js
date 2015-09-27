var _ = require('lodash');
var kramed = require('kramed');


// Utility function for splitting a list into groups
function splitBy(list, starter, ender) {
    var starts = 0;
    var ends = 0;
    var group = [];

    // Groups
    return _.reduce(list, function(groups, value) {
        // Ignore start and end delimiters in resulted groups
        if(starter(value)) {
            starts++;
        } else if(ender(value)) {
            ends++;
        }

        // Add current value to group
        group.push(value);

        // We've got a matching
        if(starts === ends && starts !== 0) {
            // Add group to end groups
            // (remove starter and ender token)
            groups.push(group.slice(1, -1));

            // Reset group
            group = [];
        }

        return groups;
    }, []);
}

function skipSpace(nodes) {
    return _.filter(nodes, function(node) {
        return node && node.type != 'space';
    });
}

function correctLoose(nodes) {
    return _.map(nodes, function(node) {
        // Return normal nodes
        if(!node || node.type != 'loose_item_start') {
            return node
        }

        // Correct loose items
        node.type = 'list_item_start';

        return node;
    })
}

function listSplit(nodes, start_type, end_type) {
    return splitBy(nodes, function(el) {
        return el.type === start_type;
    }, function(el) {
        return el.type === end_type;
    });
}

// Get the biggest list
// out of a list of kramed nodes
function filterList(nodes) {
    return _.chain(nodes)
    .toArray()
    .dropWhile(function(el) {
        // Get everything after list_start
        return el.type !== 'list_start';
    })
    .reverse()
    .dropWhile(function(el) {
        // Get everything after list_end (remember we're reversed)
        return el.type !== 'list_end';
    })
    .reverse()
    .value().slice(1, -1);
}

// Parses an Article or Chapter title
// supports extracting links
function parseTitle(src) {
    // Check if it's a link
    var matches = kramed.InlineLexer.rules.link.exec(src);

    // Not a link, return plain text
    if(!matches) {
        return {
            title: src,
            path: null,
        };
    }

    return {
        title: matches[1],
        path: matches[2],
    };
}

function parseChapter(nodes) {
    var node = _.first(nodes);
    if (!node) return null;
    if (!node.text) throw new Error("Invalid entry in the SUMMARY");

    return _.extend(parseTitle(node.text), {
        articles: _.chain(listSplit(filterList(nodes), 'list_item_start', 'list_item_end'))
            .map(function(nodes, i) {
                return parseChapter(nodes);
            })
            .compact()
            .value()
    });
}

function listGroups(src) {
    var nodes = kramed.lexer(src);

    // Get out groups of lists
    return listSplit(
        filterList(correctLoose(skipSpace(nodes))),
        'list_item_start', 'list_item_end'
    );
}

function parseSummary(src) {
    // Split out chapter sections
    var chapters = _.chain(listGroups(src))
        .map(parseChapter)
        .compact()
        .value();

    return {
        chapters: chapters
    };
}

function parseEntries(src) {
    return _.chain(listGroups(src))
        .map(parseChapter)
        .compact()
        .value();
}


function summaryToMarkdown(summary) {
    var bl = "\n";
    var content = "# Summary"+bl+bl;

    var _base = function(article) {
        if (article.path) {
            return "* ["+article.title+"]("+article.path+")";
        } else {
            return "* "+article.title;
        }
    };

    var convertArticle = function(article, d) {
        content = content + Array(4*d).join(" ") + _base(article)+bl;
        _.each(article.articles, function(_article) {
            convertArticle(_article, d + 1);
        });
    };

    _.each(summary.chapters, function(chapter) {
        convertArticle(chapter, 0);
    });

    content = content+bl;

    return content;
};


module.exports = parseSummary;
module.exports.entries = parseEntries;
module.exports.toText = summaryToMarkdown;
