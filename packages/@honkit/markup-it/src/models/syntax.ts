import Immutable from "immutable";
import Rule from "./rule";
import RulesSet from "./rules";
import defaultRules from "../constants/defaultRules";
const inherits = require("util").inherits;

const SyntaxSetRecord = Immutable.Record({
    name: String(),
    // @ts-ignore
    entryRule: new Rule(),
    // @ts-ignore
    inline: new RulesSet([]),
    // @ts-ignore
    blocks: new RulesSet([])
});

function SyntaxSet(name, def) {
    if (!(this instanceof SyntaxSet)) {
        // @ts-ignore
        return new SyntaxSet(name, def);
    }

    SyntaxSetRecord.call(this, {
        name: name,
        entryRule: def.entryRule,
        // @ts-ignore
        inline: new RulesSet(def.inline),
        // @ts-ignore
        blocks: new RulesSet(def.blocks)
    });
}
inherits(SyntaxSet, SyntaxSetRecord);

// ---- GETTERS ----
SyntaxSet.prototype.getEntryRule = function () {
    return this.get("entryRule") || defaultRules.documentRule;
};

SyntaxSet.prototype.getName = function () {
    return this.get("name");
};

SyntaxSet.prototype.getBlockRulesSet = function () {
    return this.get("blocks");
};

SyntaxSet.prototype.getInlineRulesSet = function () {
    return this.get("inline");
};

// ---- METHODS ----

SyntaxSet.prototype.getBlockRules = function () {
    return this.getBlockRulesSet().getRules();
};

SyntaxSet.prototype.getInlineRules = function () {
    return this.getInlineRulesSet().getRules();
};

SyntaxSet.prototype.getInlineRule = function (type) {
    const rulesSet = this.getInlineRulesSet();
    return rulesSet.getRule(type) || defaultRules.inlineRule;
};

SyntaxSet.prototype.getBlockRule = function (type) {
    const rulesSet = this.getBlockRulesSet();
    return rulesSet.getRule(type) || defaultRules.blockRule;
};

/**
 * Add a new rule to the inline set
 * @param {Rule} rule
 * @return {Syntax}
 */
SyntaxSet.prototype.addInlineRules = function (rule) {
    let rulesSet = this.getInlineRulesSet();
    rulesSet = rulesSet.add(rule);

    return this.set("inline", rulesSet);
};

/**
 * Add a new rule to the block set
 * @param {Rule} rule
 * @return {Syntax}
 */
SyntaxSet.prototype.addBlockRules = function (rule) {
    let rulesSet = this.getBlockRulesSet();
    rulesSet = rulesSet.add(rule);

    return this.set("inline", rulesSet);
};

export default SyntaxSet;
