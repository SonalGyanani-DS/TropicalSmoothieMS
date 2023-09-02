import * as React from "react";
import useOpenClose from "../../hooks/useOpenClose";
import { Hours } from "../../types/search/locations";

/***
 * for using the open close block for opening and closing status of the restaurant
 * 
 */

interface OpenCloseBlock {
  hoursData: Hours;
  timeZone?: string;
  id: string;
}
function OpenCloseBlock({ id, hoursData, timeZone }: OpenCloseBlock) {
  const { openObject } = useOpenClose(hoursData, timeZone);

  const formatTime = (time: string) => {
    const tempDate = new Date("January 1, 2020 " + time);
    const localeString = "en-US";

    return tempDate.toLocaleTimeString(localeString.replace("_", "-"), {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  if (openObject.isOpen) {
    if (openObject.start === "00:00" && openObject.end === "23:59") {
      return (
        <div className={"opendot notHighlight"} id={id}>
          Open 24 Hours
        </div>
      );
    } else {
      return (
        <div className={"opendot green-dot"} id={id}>
          <div className="hours-info notHighlight">
            <span className="font-main-font notHighlight">
              Open - Closes at{" "}
            </span>
            <span className="notHighlight">{formatTime(openObject.end)}</span>
          </div>
        </div>
      );
    }
  } else if (openObject.isClosed && openObject.start) {
    return (
      <div className={"closeddot 4 notHighlight"} id={id}>
        <div className="red-dot">
          <div className="hours-info notHighlight">
            <span className="font-main-font notHighlight"> Closed - </span>
            {"Opens at "}
            <span className="notHighlight">{formatTime(openObject.start)}</span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="closeddot 2 notHighlight" id={id}>
        <div className="red-dot notHighlight">
          <div className="hours-info notHighlight">Closed</div>
        </div>
      </div>
    );
  }
}

export default OpenCloseBlock;
