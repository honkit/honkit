// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TemplateOu... Remove this comment to see the full error message
const TemplateOutput = Immutable.Record(
    {
        // Text content of the template
        content: String(),

        // Map of blocks to replace / post process
        blocks: Immutable.Map(),
    },
    "TemplateOutput"
);

TemplateOutput.prototype.getContent = function () {
    return this.get("content");
};

TemplateOutput.prototype.getBlocks = function () {
    return this.get("blocks");
};

/**
 * Update content of this output
 * @param {String} content
 * @return {TemplateContent}
 */
TemplateOutput.prototype.setContent = function (content) {
    return this.set("content", content);
};

/**
 * Create a TemplateOutput from a text content
 * and an object containing block definition
 * @param {String} content
 * @param {Object} blocks
 * @return {TemplateOutput}
 */
TemplateOutput.create = function (content, blocks) {
    return new TemplateOutput({
        content: content,
        blocks: Immutable.fromJS(blocks),
    });
};

module.exports = TemplateOutput;
