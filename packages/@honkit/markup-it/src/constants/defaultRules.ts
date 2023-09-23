import Rule from "../models/rule";

import BLOCKS from "./blocks";
import STYLES from "./styles";

const defaultDocumentRule = Rule(BLOCKS.DOCUMENT)
    .match((state, text) => {
        return {
            tokens: state.parseAsBlock(text)
        };
    })
    .toText((state, token) => {
        return state.renderAsBlock(token);
    });

const defaultBlockRule = Rule(BLOCKS.TEXT)
    .match((state, text) => {
        return {
            tokens: state.parseAsInline(text)
        };
    })
    .toText("%s\n");

const defaultInlineRule = Rule(STYLES.TEXT)
    .match((state, text) => {
        return {
            text: text
        };
    })
    .toText("%s");

export default {
    documentRule: defaultDocumentRule,
    blockRule: defaultBlockRule,
    inlineRule: defaultInlineRule
};
