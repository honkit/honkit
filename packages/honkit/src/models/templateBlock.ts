import is from "is";
import extend from "extend";
import Immutable from "immutable";
import Promise from "../utils/promise";
import genKey from "../utils/genKey";
import TemplateShortcut from "./templateShortcut";
import nunjucks from "nunjucks";

const NODE_ENDARGS = "%%endargs%%";

class TemplateBlock extends Immutable.Record(
    {
        // Name of block, also the start tag
        name: String(),

        // End tag, default to "end<name>"
        end: String(),

        // Function to process the block content
        process: Function(),

        // List of String, for inner block tags
        blocks: Immutable.List(),

        // List of shortcuts to replace with this block
        shortcuts: Immutable.Map()
    },
    "TemplateBlock"
) {
    getName(): string {
        return this.get("name");
    }

    getEndTag(): string {
        return this.get("end") || `end${this.getName()}`;
    }

    getProcess(): Function {
        return this.get("process");
    }

    getBlocks(): Immutable.List<string> {
        return this.get("blocks");
    }

    /**
     * Return shortcuts associated with this block or undefined
     * @return {TemplateShortcut|undefined}
     */
    getShortcuts(): TemplateShortcut {
        const shortcuts = this.get("shortcuts");
        if (shortcuts.size === 0) {
            return undefined;
        }
        return TemplateShortcut.createForBlock(this, shortcuts);
    }

    /**
     * Return name for the nunjucks extension
     * @return {string}
     */
    getExtensionName(): string {
        return `Block${this.getName()}Extension`;
    }

    /**
     * Return a nunjucks extension to represents this block
     * @return {Nunjucks.Extension}
     */
    toNunjucksExt(mainContext, blocksOutput): nunjucks.Extension {
        blocksOutput = blocksOutput || {};

        const that = this;
        const name = this.getName();
        const endTag = this.getEndTag();
        const blocks = this.getBlocks().toJS();

        function Ext() {
            this.tags = [name];

            this.parse = function (parser, nodes) {
                let lastBlockName = null;
                let lastBlockArgs = null;
                const allBlocks = blocks.concat([endTag]);

                // Parse first block
                const tok = parser.nextToken();
                lastBlockArgs = parser.parseSignature(null, true);
                parser.advanceAfterBlockEnd(tok.value);

                const args = new nodes.NodeList();
                const bodies = [];
                const blockNamesNode = new nodes.Array(tok.lineno, tok.colno);
                const blockArgCounts = new nodes.Array(tok.lineno, tok.colno);

                // Parse while we found "end<block>"
                do {
                    // Read body
                    const currentBody = parser.parseUntilBlocks.apply(parser, allBlocks);

                    // Handle body with previous block name and args
                    blockNamesNode.addChild(new nodes.Literal(args.lineno, args.colno, lastBlockName));
                    blockArgCounts.addChild(new nodes.Literal(args.lineno, args.colno, lastBlockArgs.children.length));
                    bodies.push(currentBody);

                    // Append arguments of this block as arguments of the run function
                    lastBlockArgs.children.forEach((child) => {
                        args.addChild(child);
                    });

                    // Read new block
                    lastBlockName = parser.nextToken().value;

                    // Parse signature and move to the end of the block
                    if (lastBlockName != endTag) {
                        lastBlockArgs = parser.parseSignature(null, true);
                    }

                    parser.advanceAfterBlockEnd(lastBlockName);
                } while (lastBlockName != endTag);

                args.addChild(blockNamesNode);
                args.addChild(blockArgCounts);
                args.addChild(new nodes.Literal(args.lineno, args.colno, NODE_ENDARGS));

                return new nodes.CallExtensionAsync(this, "run", args, bodies);
            };

            this.run = function (context) {
                const fnArgs = Array.prototype.slice.call(arguments, 1);

                let args;
                const blocks = [];
                let bodies = [];

                // Extract callback
                const callback = fnArgs.pop();

                // Detect end of arguments
                const endArgIndex = fnArgs.indexOf(NODE_ENDARGS);

                // Extract arguments and bodies
                args = fnArgs.slice(0, endArgIndex);
                bodies = fnArgs.slice(endArgIndex + 1);

                // Extract block counts
                const blockArgCounts = args.pop();
                const blockNames = args.pop();

                // Recreate list of blocks
                blockNames.forEach((name, i) => {
                    const countArgs = blockArgCounts[i];
                    const blockBody = bodies.shift();

                    const blockArgs = countArgs > 0 ? args.slice(0, countArgs) : [];
                    args = args.slice(countArgs);
                    const blockKwargs = extractKwargs(blockArgs);

                    blocks.push({
                        name: name,
                        body: blockBody(),
                        args: blockArgs,
                        kwargs: blockKwargs
                    });
                });

                const mainBlock = blocks.shift();
                mainBlock.blocks = blocks;

                Promise()
                    .then(() => {
                        const ctx = extend(
                            {
                                ctx: context
                            },
                            mainContext || {}
                        );

                        return that.applyBlock(mainBlock, ctx);
                    })
                    .then((result) => {
                        return that.blockResultToHtml(result, blocksOutput);
                    })
                    .nodeify(callback);
            };
        }

        // @ts-expect-error: nunjucks.Extension
        return Ext;
    }

    /**
     * Apply a block to a content
     * @param {Object} inner
     * @param {Object} context
     * @return {Promise<String>|String}
     */
    applyBlock(inner, context) {
        const processFn = this.getProcess();

        inner = inner || {};
        inner.args = inner.args || [];
        inner.kwargs = inner.kwargs || {};
        inner.blocks = inner.blocks || [];

        const r = processFn.call(context, inner);

        if (Promise.isPromiseAlike(r)) {
            return r.then(this.normalizeBlockResult.bind(this));
        } else {
            return this.normalizeBlockResult(r);
        }
    }

    /**
     * Normalize result from a block process function
     * @param {Object|String} result
     * @return {Object}
     */
    normalizeBlockResult(result) {
        if (is.string(result)) {
            result = { body: result };
        }
        result.name = this.getName();

        return result;
    }

    /**
     * Convert a block result to HTML
     * @param {Object} result
     * @param {Object} blocksOutput: stored post processing blocks in this object
     * @return {string}
     */
    blockResultToHtml(result, blocksOutput) {
        let indexedKey;
        const toIndex = !result.parse || result.post !== undefined;

        if (toIndex) {
            indexedKey = genKey();
            blocksOutput[indexedKey] = result;
        }

        // Parsable block, just return it
        if (result.parse) {
            return result.body;
        }

        // Return it as a position marker
        return `{{-%${indexedKey}%-}}`;
    }

    /**
     * Create a template block from a function or an object
     * @param {string} blockName
     * @param {Object} block
     * @return {TemplateBlock}
     */
    static create(blockName, block) {
        if (is.fn(block)) {
            // @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
            block = new Immutable.Map({
                process: block
            });
        }

        block = new TemplateBlock(block);
        block = block.set("name", blockName);
        return block;
    }
}

/**
 * Extract kwargs from an arguments array
 * @param {Array} args
 * @return {Object}
 */
function extractKwargs(args: any[]) {
    const last = args[args.length - 1];
    return is.object(last) && last.__keywords ? args.pop() : {};
}

export default TemplateBlock;
