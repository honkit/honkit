import Immutable from "immutable";
import is from "is";
import Rule from "./rule";
const inherits = require("util").inherits;
const RulesSetRecord = Immutable.Record({
    rules: Immutable.List()
});

function RulesSet(rules) {
    if (!(this instanceof RulesSet)) {
        // @ts-expect-error workaround instanceof
        return new RulesSet(rules);
    }

    // @ts-ignore
    rules = new RulesList(rules);

    RulesSetRecord.call(this, {
        rules: rules
    });
}
inherits(RulesSet, RulesSetRecord);

// ---- GETTERS ----

RulesSet.prototype.getRules = function () {
    return this.get("rules");
};

// ---- METHODS ----

/**
 * Add a rule / or rules
 * @param {Rule|RulesSet|Array} rules
 * @return {RulesSet}
 */
RulesSet.prototype.add = function (newRules) {
    let rules = this.getRules();

    // Prepare new rules
    // @ts-ignore
    newRules = new RulesList(newRules);

    // Concat rules
    rules = rules.concat(newRules);

    return this.set("rules", rules);
};

/**
 * Add a rule / or rules at the beginning
 * @param {Rule|RulesSet|Array} rules
 * @return {RulesSet}
 */
RulesSet.prototype.unshift = function (newRules) {
    let rules = this.getRules();

    // Prepare new rules
    // @ts-ignore
    newRules = new RulesList(newRules);

    // Add rules
    rules = rules.unshift.apply(rules, newRules.toArray());

    return this.set("rules", rules);
};

/**
 * Remove a rule by its type
 * @param {string} ruleType
 * @return {RulesSet}
 */
RulesSet.prototype.del = function (ruleType) {
    let rules = this.getRules();

    rules = rules.filterNot((rule) => {
        return rule.getType() == ruleType;
    });

    return this.set("rules", rules);
};

/**
 * Replace a rule type by a new rule
 * @param {Rule} rule
 * @return {RulesSet}
 */
RulesSet.prototype.replace = function (rule) {
    return this.del(rule.getType()).add(rule);
};

/**
 * Get a specific rule using its type
 * @param {string} ruleType
 * @return {Rule}
 */
RulesSet.prototype.getRule = function (ruleType) {
    const rules = this.getRules();

    return rules.find((rule) => {
        return rule.getType() == ruleType;
    });
};

/**
 * Build a list of rules
 * @param {Rule|RulesSet|Array} rules
 * @return {List<Rule>}
 */
function RulesList(rules) {
    if (rules instanceof Rule) {
        return Immutable.List([rules]);
    }

    if (is.array(rules)) {
        return Immutable.List(rules);
    }

    if (rules instanceof RulesSet) {
        // @ts-ignore
        return rules.getRules();
    }

    return rules || Immutable.List();
}

export default RulesSet;
