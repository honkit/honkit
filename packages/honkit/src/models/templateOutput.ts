import Immutable from "immutable";
import TemplateBlock from "./templateBlock";

class TemplateOutput extends Immutable.Record(
    {
        // Text content of the template
        content: String(),

        // Map of blocks to replace / post process
        blocks: Immutable.Map()
    },
    "TemplateOutput"
) {
    getContent(): string {
        return this.get("content");
    }

    getBlocks(): TemplateBlock {
        return this.get("blocks");
    }

    /**
     * Update content of this output
     */
    setContent(content: string): TemplateOutput {
        return this.set("content", content) as TemplateOutput;
    }

    /**
     * Create a TemplateOutput from a text content
     * and an object containing block definition
     */
    static create(content: string, blocks: object): TemplateOutput {
        return new TemplateOutput({
            content: content,
            blocks: Immutable.fromJS(blocks)
        });
    }
}

export default TemplateOutput;
