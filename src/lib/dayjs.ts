import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/es";

// Configure plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// Configure Spanish locale
dayjs.locale("es");

export { dayjs };
