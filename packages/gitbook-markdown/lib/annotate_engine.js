function annotateEngine(src, rules, ruleTypes, ruleMap) {
    var tokens = [];

    while(src) {
        // Pick rule
        var rule = ruleTypes.filter(function(ruleName, idx) {
            var regex = rules[ruleName];
            return regex.exec(src);
        })[0];

        // No matching rules
        if(!rule) {
            throw new Error('No rule found for: ' + src);
        }

        // Use rule to extract block
        var ruleRegex = rules[rule];
        var block = ruleRegex.exec(src);

        // Get rule type
        var type = ruleMap[rule] || rule;

        // Get raw text
        var raw = block[0];

        // Break out here to avoid infinite loops
        if(raw.length === 0) {
            break;
        }

        tokens.push({
            type: ruleMap[rule] || rule,
            raw: raw,
        });

        // Update source
        src = src.substring(raw.length);
    }

    return tokens;
}

module.exports = annotateEngine;
