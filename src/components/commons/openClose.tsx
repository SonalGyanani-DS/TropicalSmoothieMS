import * as React from "react";
import { houtsIcon } from "../../sites-global/global";
import { StaticData } from "../../sites-global/staticData";
import OpenCloseBlock from "./OpenCloseBlock";
import { DayStringType, Hours } from "../../types/search/locations";
import { Interval } from "../../types/search/locations";

interface OpenCloseProps {
  hours?: Hours | null;
  id: string;
  infowindow?: boolean;
  timezone?: string;
}

/***
 * for using the opening and closing status of the restaurant
 * 
 */

export const OpenStausFunctions = {
  formatOpenNowString: (hoursData: Hours, timeZone = "") => {
    const now = new Date();
    const currentTime = new Date(
      now.toLocaleString("en-US", { timeZone: timeZone })
    );

    const tomorrow = new Date(currentTime.getTime() + 60 * 60 * 24 * 1000);
    let nextTomorrow = new Date(tomorrow.getTime() + 86400000);
    let Day = 0;
    const yesterday = new Date(currentTime.getTime() - 60 * 60 * 24 * 1000);
    const nowTimeNumber =
      currentTime.getHours() + currentTime.getMinutes() / 60;

    const intervalsToday = OpenStausFunctions.getIntervalOnDate(
      currentTime,
      hoursData
    );
    const intervalsTomorrow = OpenStausFunctions.getIntervalOnDate(
      tomorrow,
      hoursData
    );
    const intervalsnextTommorow = OpenStausFunctions.getIntervalOnDate(
      nextTomorrow,
      hoursData
    );
    const intervalsYesterday = OpenStausFunctions.getIntervalOnDate(
      yesterday,
      hoursData
    );
    let openRightNow = false;
    let currentInterval: Interval | null = null;
    let nextInterval: Interval | null = null;

    if (intervalsYesterday) {
      for (let i = 0; i < intervalsYesterday.length; i++) {
        const interval: Interval = intervalsYesterday[i];
        const startIntervalNumber = OpenStausFunctions.timeStringToNumber(
          interval.start || ""
        );
        const endIntervalNumber = OpenStausFunctions.timeStringToNumber(
          interval.end || ""
        );

        // If end overflows to the next day (i.e. today).
        if (endIntervalNumber < startIntervalNumber) {
          if (nowTimeNumber < endIntervalNumber) {
            currentInterval = interval;
            openRightNow = true;
          }
        }
      }
    }

    // Assumes no overlapping intervals
    if (intervalsToday) {
      for (let i = 0; i < intervalsToday.length; i++) {
        const interval = intervalsToday[i];
        const startIntervalNumber = OpenStausFunctions.timeStringToNumber(
          interval.start || ""
        );
        const endIntervalNumber = OpenStausFunctions.timeStringToNumber(
          interval.end || ""
        );

        // If current time doesn't belong to one of yesterdays interval.
        if (currentInterval == null) {
          if (endIntervalNumber < startIntervalNumber) {
            if (nowTimeNumber >= startIntervalNumber) {
              currentInterval = interval;
              openRightNow = true;
            }
          } else if (
            nowTimeNumber >= startIntervalNumber &&
            nowTimeNumber < endIntervalNumber
          ) {
            currentInterval = interval;
            // console.log(currentInterval, endIntervalNumber);
            openRightNow = true;
          }
        }

        if (nextInterval == null) {
          if (startIntervalNumber > nowTimeNumber) {
            nextInterval = interval;
          }
        } else {
          if (
            startIntervalNumber > nowTimeNumber &&
            startIntervalNumber <
              OpenStausFunctions.timeStringToNumber(nextInterval.start || "")
          ) {
            nextInterval = interval;
          }
        }
      }
    }

    let nextIsTomorrow = false;

    // If no more intervals in the day
    if (nextInterval == null) {
      if (intervalsTomorrow) {
        if (intervalsTomorrow.length > 0) {
          nextInterval = intervalsTomorrow[0];
          Day = tomorrow.getDay();

          nextIsTomorrow = true;
        }
      } else if (intervalsnextTommorow) {
        if (intervalsnextTommorow.length > 0) {
          nextInterval = intervalsnextTommorow[0];
          Day = nextTomorrow.getDay();

          nextIsTomorrow = true;
        }
      } else if (
        OpenStausFunctions.getIntervalOnDate(
          new Date(nextTomorrow.getTime() + 86400000),
          hoursData
        )
      ) {
        nextTomorrow = new Date(nextTomorrow.getTime() + 86400000);

        Day = nextTomorrow.getDay();
        const nextintervals = OpenStausFunctions.getIntervalOnDate(
          nextTomorrow,
          hoursData
        );
        if (nextintervals && nextintervals.length > 0) {
          nextInterval = nextintervals[0];
          nextIsTomorrow = true;
        }
      } else if (
        OpenStausFunctions.getIntervalOnDate(
          new Date(nextTomorrow.getTime() + 172800000),
          hoursData
        )
      ) {
        nextTomorrow = new Date(nextTomorrow.getTime() + 172800000);

        Day = nextTomorrow.getDay();
        const nextintervals = OpenStausFunctions.getIntervalOnDate(
          nextTomorrow,
          hoursData
        );
        if (nextintervals && nextintervals.length > 0) {
          nextInterval = nextintervals[0];
          nextIsTomorrow = true;
        }
      } else if (
        OpenStausFunctions.getIntervalOnDate(
          new Date(nextTomorrow.getTime() + 86400000 + 172800000),
          hoursData
        )
      ) {
        nextTomorrow = new Date(nextTomorrow.getTime() + 86400000 + 172800000);
        Day = nextTomorrow.getDay();
        const nextintervals = OpenStausFunctions.getIntervalOnDate(
          nextTomorrow,
          hoursData
        );
        if (nextintervals && nextintervals.length > 0) {
          nextInterval = nextintervals[0];
          nextIsTomorrow = true;
        }
      }
    }

    const week = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

    if (openRightNow) {
      if (
        currentInterval &&
        currentInterval.start === "00:00" &&
        currentInterval.end === "23:59"
      ) {
        return <div className={"opendot"}>Open 24 Hours</div>;
      } else if (currentInterval) {
        return (
          <div className={"opendot green-dot"}>
            <div className="location-icon">
              <div dangerouslySetInnerHTML={{ __html: houtsIcon }} />{" "}
            </div>
            <div className="hours-info ">
              {" "}
              <span className=" "> Open - Closes at </span>
              <span className="lowercase">
                {OpenStausFunctions.formatTime(
                  currentInterval.end || ""
                ).replace(":00", "")}
              </span>{" "}
            </div>
          </div>
        );
      }
    } else if (nextInterval) {
      if (nextIsTomorrow) {
        return (
          <div className={"closeddot 4"}>
            <div className="red-dot">
              <div className="location-icon">
                <div dangerouslySetInnerHTML={{ __html: houtsIcon }} />{" "}
              </div>
              <div className="hours-info ">
                <span className="font-main-font"> - </span>
                {"Opens at "}
                <span className="lowercase">
                  {OpenStausFunctions.formatTime(
                    nextInterval.start || ""
                  ).replace(":00", "")}
                </span>{" "}
                {week[Day]}
              </div>
            </div>{" "}
          </div>
        );
      } else {
        return (
          <div className={"closeddot 3"}>
            <div className="red-dot closeddot">
              <div className="location-icon">
                <div dangerouslySetInnerHTML={{ __html: houtsIcon }} />{" "}
              </div>
              <div className="hours-info ">
                <span className="">Closed - Opens at</span>
                <span className="">
                  {OpenStausFunctions.formatTime(
                    nextInterval.start || ""
                  ).replace(":00", "")}
                </span>
              </div>{" "}
            </div>{" "}
          </div>
        );
      }
    } else {
      return (
        <div className="closeddot 2">
          <div className="red-dot closeddot">
            <div className="location-icon">
              <div dangerouslySetInnerHTML={{ __html: houtsIcon }} />{" "}
            </div>
            <div className="hours-info ">Closed</div>{" "}
          </div>
        </div>
      );
    }
  },
  getYextTimeWithUtcOffset: (entityUtcOffsetSeconds: number) => {
    const now = new Date();
    let utcOffset = 0;
    if (entityUtcOffsetSeconds) {
      utcOffset = entityUtcOffsetSeconds * 1000;
    }
    if (utcOffset !== 0) {
      const localUtcOffset = now.getTimezoneOffset() * 60 * 1000;
      return new Date(now.valueOf() + utcOffset + localUtcOffset);
    }
    return now;
  },
  parseTimeZoneUtcOffset: (timeString: string) => {
    if (!timeString) {
      return 0;
    }
    const parts = timeString.split(":");
    const hours = parseInt(parts[0].replace(/\u200E/g, ""), 10);
    const minutes = parseInt(parts[1].replace(/\u200E/g, ""), 10);
    if (hours < 0) {
      return -(Math.abs(hours) + minutes / 60) * 60 * 60;
    }
    return (hours + minutes / 60) * 60 * 60;
  },

  timeStringToNumber: (timeString: string) => {
    const parts = timeString.split(":");
    const hours = parseInt(parts[0].replace(/\u200E/g, ""), 10);
    const minutes = parseInt(parts[1].replace(/\u200E/g, ""), 10);
    return hours + minutes / 60;
  },
  getIntervalOnDate: (date: Date, hoursData: Hours) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const dateString =
      year +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (day < 10 ? "0" + day : day);
    const dayOfWeekString = days[date.getDay()];

    // Check for holiday
    if (hoursData && hoursData.holidayHours) {
      for (let i = 0; i < hoursData.holidayHours.length; i++) {
        const holiday = hoursData.holidayHours[i];
        if (holiday.date == dateString) {
          if (holiday.openIntervals) {
            return holiday.openIntervals;
          } else if (holiday.isClosed === true) {
            return null; // On holiday but closed
          }
        }
      }
    }

    // Not on holiday
    if (
      hoursData &&
      hoursData[dayOfWeekString as DayStringType] &&
      hoursData[dayOfWeekString as DayStringType]?.openIntervals
    ) {
      return hoursData[dayOfWeekString as DayStringType]?.openIntervals;
    } else {
      return null;
    }
  },
  formatTime: (time: string) => {
    const tempDate = new Date("January 1, 2020 " + time);
    const localeString = "en-US";

    return tempDate.toLocaleTimeString(localeString.replace("_", "-"), {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  },
  getUtcOffsetFromTimeZone: (timeZone: string, date = new Date()) => {
    const tz = date
      .toLocaleString("en-gb", { timeZone, timeStyle: "long" })
      .split(" ")
      .slice(-1)[0];
    const dateString = date.toString();
    const offset =
      Date.parse(`${dateString} UTC`) - Date.parse(`${dateString} ${tz}`);
    return OpenStausFunctions.msToTime(offset);
  },
  msToTime: (duration: number) => {
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = hours < 10 ? hours : hours;
    return hours + ":00";
  },
};

export default function OpenClose(props: OpenCloseProps) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : props.timezone;
  return (
    <>
      {props.hours && props.hours.reopenDate ? (
        <h3 className="text-2xl md:text-[28px] notHighlight" id={props.id}>
          {StaticData.tempClosed}
        </h3>
      ) : props.hours ? (
        <div className="closeing-div notHighlight">
          {props.infowindow ? (
            OpenStausFunctions.formatOpenNowString(props.hours, timezone)
          ) : (
            <OpenCloseBlock
              id={props.id}
              hoursData={props.hours}
              timeZone={timezone}
            />
          )}
        </div>
      ) : (
        <div className="closeddot  1 notHighlight">
          <div className="red-dot notHighlight">
            <div className="hours-info notHighlight">Closed</div>{" "}
          </div>
        </div>
      )}
    </>
  );
}
