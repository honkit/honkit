// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Immutable'... Remove this comment to see the full error message
const Immutable = require("immutable");
const moment = require("moment");

module.exports = Immutable.Map({
    // Format a date
    // ex: 'MMMM Do YYYY, h:mm:ss a
    date: function (time, format) {
        return moment(time).format(format);
    },

    // Relative Time
    dateFromNow: function (time) {
        return moment(time).fromNow();
    },
});
