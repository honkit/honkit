const reHeading = require("./re/heading");
const markup = require("../../");

/**
 * Parse inner text of header to extract ID entity
 * @param  {ParsingState} state
 * @param  {String} text
 * @return {TokenLike}
 */
function parseHeadingText(state, text) {
    reHeading.id.lastIndex = 0;
    const match = reHeading.id.exec(text);
    const id = match ? match[2] : null;
    if (id) {
        // Remove ID from text
        text = text.replace(match[0], "").trim();
    } else {
        text = text.trim();
    }

    return {
        tokens: state.parseAsInline(text),
        data: {
            id: id,
        },
    };
}

/**
 * Generator for HEADING_X rules
 * @param  {Number} level
 * @return {Rule}
 */
function headingRule(level) {
    const prefix = Array(level + 1).join("#");

    return (
        markup
            .Rule(markup.BLOCKS[`HEADING_${level}`])

            // Normal heading like
            .regExp(reHeading.normal, (state, match) => {
                if (match[1].length != level) {
                    return;
                }

                return parseHeadingText(state, match[2]);
            })

            // Line heading
            .regExp(reHeading.line, (state, match) => {
                const matchLevel = match[2] === "=" ? 1 : 2;
                if (matchLevel != level) {
                    return;
                }

                return parseHeadingText(state, match[1]);
            })

            .toText((state, token) => {
                const data = token.getData();
                let innerContent = state.renderAsInline(token);
                const id = data.get("id");

                if (id) {
                    innerContent += ` {#${id}}`;
                }

                return `${prefix} ${innerContent}\n\n`;
            })
    );
}

module.exports = headingRule;
