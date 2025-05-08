import dayjs from "dayjs";
import duration_plugin from "dayjs/plugin/duration";
import relativeTime_plugin from "dayjs/plugin/relativeTime";
import utc_plugin from "dayjs/plugin/utc";

export const initDayJsLibrary = () => {
  dayjs.extend(utc_plugin);
  dayjs.extend(relativeTime_plugin);
  dayjs.extend(duration_plugin);    
};

