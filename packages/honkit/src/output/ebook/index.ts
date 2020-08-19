// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extend'.
const extend = require("extend");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'WebsiteGen... Remove this comment to see the full error message
const WebsiteGenerator = require("../website");

module.exports = extend({}, WebsiteGenerator, {
    name: "ebook",
    Options: require("./options"),
    onPage: require("./onPage"),
    onFinish: require("./onFinish"),
});
