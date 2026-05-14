import Immutable from "immutable";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default Immutable.Map({
    // Format a date
    // ex: 'MMMM Do YYYY, h:mm:ss a
    date: function (time, format) {
        return dayjs(time).format(format);
    },

    // Relative Time
    dateFromNow: function (time) {
        return dayjs(time).fromNow();
    }
});
