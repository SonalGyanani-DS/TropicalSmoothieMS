import * as React from "react";
import { HolidayHours, Interval } from "../../types/search/locations";
const Holidayhours = (props: {
  hours: HolidayHours[];
  c_specific_day: { holidayDate: Date; holidayName: string }[];
}) => {
  return (
    <>
      {props.hours.map((res: HolidayHours) => {
        const weeks = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const d = new Date(res.date);
        const day = d.getDay();
        function join(t: Date, a: Intl.DateTimeFormatOptions[], s: string) {
          function format(m: Intl.DateTimeFormatOptions) {
            const f = new Intl.DateTimeFormat("en", m);
            return f.format(t);
          }
          return a.map(format).join(s);
        }

        const options: Intl.DateTimeFormatOptions[] = [
          { day: "numeric", month: undefined, year: undefined },
          { month: "long", day: undefined, year: undefined },
          { year: "numeric", day: undefined, month: undefined },
        ];

        const d1 = new Date();
        const d2 = new Date(res.date);
        if (d2.getDate() >= d1.getDate()) {
          return (
            <div className="pop-up-holyhrs">
              <div>{join(new Date(res.date), options, "-")}</div>
              <div>{weeks[day]}</div>
              {res.isClosed ? (
                <span className="cl-time">Closed</span>
              ) : (
                <>
                  {res.openIntervals &&
                    res.openIntervals.map(
                      (openinterval: Interval, index: number) => {
                        return (
                          <div key={index}>
                            <span className="op-time">
                              {openinterval.start}
                            </span>{" "}
                            <span className="spac-bx"> - </span>{" "}
                            <span className="cl-time">{openinterval.end}</span>
                          </div>
                        );
                      }
                    )}
                </>
              )}
              {props.c_specific_day &&
                props.c_specific_day.map(
                  (specificDay: { holidayDate: Date; holidayName: string }) => {
                    return (
                      <>
                        <div>
                          {specificDay.holidayDate == res.date ? (
                            <span className="specificday">
                              {specificDay.holidayName}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    );
                  }
                )}
            </div>
          );
        }
      })}
    </>
  );
};
export default Holidayhours;
