import dayjs from "dayjs";
import utc_plugin from "dayjs/plugin/utc";
import relativeTime_plugin from "dayjs/plugin/relativeTime";
import duration_plugin from "dayjs/plugin/duration";

export const initDayJsLibrary = () => {
  dayjs.extend(utc_plugin);
  dayjs.extend(relativeTime_plugin);
  dayjs.extend(duration_plugin);    
};

