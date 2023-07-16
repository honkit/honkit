import Immutable from "immutable";
import TemplateBlock from "../models/templateBlock";

export default Immutable.Map({
    html: new TemplateBlock({
        name: "html",
        process: function (blk) {
            return blk;
        }
    }),

    code: new TemplateBlock({
        name: "code",
        process: function (blk) {
            return {
                html: false,
                body: blk.body
            };
        }
    }),

    markdown: new TemplateBlock({
        name: "markdown",
        process: function (blk) {
            console.log("blk", blk); // TODO::::::
            return this.book.renderInline("markdown", blk.body).then((out) => {
                return { body: out };
            });
        }
    }),

    asciidoc: new TemplateBlock({
        name: "asciidoc",
        process: function (blk) {
            return this.book.renderInline("asciidoc", blk.body).then((out) => {
                return { body: out };
            });
        }
    }),

    markup: new TemplateBlock({
        name: "markup",
        process: function (blk) {
            return this.book.renderInline(this.ctx.file.type, blk.body).then((out) => {
                return { body: out };
            });
        }
    })
});
