var _ = require('lodash');
var kramed = require('kramed');

// Get all the pairs of header + paragraph in a list of nodes
function groups(nodes) {
    // A list of next nodes
    var next = nodes.slice(1).concat(null);

    return _.reduce(nodes, function(accu, node, idx) {
        // Skip
        if(!(
            node.type === 'heading' &&
            (next[idx] && next[idx].type === 'paragraph')
        )) {
            return accu;
        }

        // Add group
        accu.push([
            node,
            next[idx]
        ]);

        return accu;
    }, []);
}

function parseGlossary(src) {
    var nodes = kramed.lexer(src);

    return groups(nodes)
    .map(function(pair) {
        // Simplify each group to a simple object with name/description
        return {
            name: pair[0].text,
            description: pair[1].text,
        };
    });
}

function glossaryToMarkdown(glossary) {
    var bl = "\n";

    var body = _.map(glossary, function(entry) {
        return "## "+entry.name+bl+bl+entry.description;
    }).join(bl+bl);

    return "# Glossary"+bl+bl+body;
}

module.exports = parseGlossary;
module.exports.toText = glossaryToMarkdown;
