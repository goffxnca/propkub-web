import { BellIcon } from "@heroicons/react/solid";
import TimeAgo from "timeago-react";
import * as timeago from "timeago.js";
import th from "timeago.js/lib/lang/th";

timeago.register("th", th);

const NotificationItem = ({ title, read, createdAtISO }) => {
  console.log("NotificationItem...");

  return (
    <div className="flex items-center gap-x-2">
      <div
        className={`flex items-center justify-center w-6 h-6 ${
          read ? "bg-gray-100" : "bg-green-100"
        } rounded-full`}
      >
        {/* <div
          className={`w-2 h-2 ${
            read ? "bg-gray-400" : "bg-green-400"
          } rounded-full`}
        ></div> */}
        <BellIcon
          className={`w-4 h-4 ${
            read ? "text-gray-400" : "text-green-400"
          } rounded-full`}
          aria-hidden="true"
        />
      </div>

      <div>
        <div>{title}</div>
        <div className="text-left text-gray-400 text-xs">
          <TimeAgo datetime={createdAtISO} locale="th" />
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
