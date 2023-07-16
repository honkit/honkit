import Immutable from "immutable";
import Parser from "./parser";
import TemplateBlock from "./templateBlock";

/*
    A TemplateShortcut is defined in plugin's template blocks
    to replace content with a templating block using delimiters.
*/
class TemplateShortcut extends Immutable.Record(
    {
        // List of parser names accepting this shortcut
        parsers: Immutable.Map(),

        start: String(),
        end: String(),

        startTag: String(),
        endTag: String()
    },
    "TemplateShortcut"
) {
    getStart(): string {
        return this.get("start");
    }

    getEnd(): string {
        return this.get("end");
    }

    getStartTag(): string {
        return this.get("startTag");
    }

    getEndTag(): string {
        return this.get("endTag");
    }

    getParsers(): Parser {
        return this.get("parsers");
    }

    /**
     Test if this shortcut accept a parser

     @param {Parsers|String} parser
     @return {boolean}
     */
    acceptParser(parser: Parser | string) {
        if (typeof parser !== "string") {
            parser = parser.getName();
        }

        const parserNames = this.get("parsers");
        return parserNames.includes(parser);
    }

    /**
     Create a shortcut for a block

     @param {TemplateBlock} block
     @param {Map} details
     @return {TemplateShortcut}
     */
    static createForBlock(block: TemplateBlock, details: Immutable.Map<string, any>): TemplateShortcut {
        details = Immutable.fromJS(details);

        return new TemplateShortcut({
            parsers: details.get("parsers"),
            start: details.get("start"),
            end: details.get("end"),
            startTag: block.getName(),
            endTag: block.getEndTag()
        });
    }
}

export default TemplateShortcut;
