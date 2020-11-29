import is from "is";
import Immutable from "immutable";

import Token from "../models/token";

/**
 * Match a text using a rule
 * @param {ParsingState} state
 * @param {Rule} rule
 * @param {string} text
 * @return {List<Token>|null}
 */
function matchRule(state, rule, text) {
    let matches = rule.onText(state, text);
    const ruleType = rule.getType();

    if (!matches) {
        return;
    }
    if (!is.array(matches) && !Immutable.List.isList(matches)) {
        matches = [matches];
    }

    return Immutable.List(matches).map((match) => {
        // @ts-ignore
        return Token.create(match.type || ruleType, match);
    });
}

export default matchRule;
