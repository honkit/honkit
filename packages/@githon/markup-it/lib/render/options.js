const Immutable = require("immutable");

const RenderOptions = Immutable.Record({
    // Transform the output of the render of a token
    annotate: function (state, raw, token) {
        return raw;
    },
});

RenderOptions.prototype.getAnnotateFn = function () {
    return this.get("annotate");
};

module.exports = RenderOptions;
