import * as React from "react";
import { useEffect, useState } from "react";
import { StaticData } from "../../sites-global/staticData";
import { OpenStausFunctions } from "./openClose";
import { HolidayHours, HoursDoc, Interval } from "../../types/search/locations";


type Hours = {
  title?: string;
  hours: HoursDoc;
  additionalHoursText?: string;
  children?: React.ReactNode;
  c_specificDay?: string ;
  reopenDate?: Date | undefined;
};

export interface Week extends Record<string, unknown> {
  monday?: Day;
  tuesday?: Day;
  wednesday?: Day;
  thursday?: Day;
  friday?: Day;
  saturday?: Day;
  sunday?: Day;
}

type Day = {
  isClosed: boolean;
  openIntervals: OpenIntervals[];
};

type OpenIntervals = {
  start: string;
  end: string;
};

const todayIndex = new Date().getDay();

/**
 * Dynamically creates a sort order based on today's day.
 */
function getSorterForCurrentDay(): { [key: string]: number } {
  const dayIndexes = [0, 1, 2, 3, 4, 5, 6];

  const updatedDayIndexes = [];
  for (let i = 0; i < dayIndexes.length; i++) {
    let dayIndex = dayIndexes[i];
    if (dayIndex - todayIndex >= 0) {
      dayIndex = dayIndex - todayIndex;
    } else {
      dayIndex = dayIndex + 7 - todayIndex;
    }
    updatedDayIndexes[i] = dayIndex;
  }

  return {
    sunday: updatedDayIndexes[0],
    monday: updatedDayIndexes[1],
    tuesday: updatedDayIndexes[2],
    wednesday: updatedDayIndexes[3],
    thursday: updatedDayIndexes[4],
    friday: updatedDayIndexes[5],
    saturday: updatedDayIndexes[6],
  };
}

const defaultSorter: { [key: string]: number } = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function sortByDay(week: HoursDoc): Week {
  const tmp = [];
  for (const [k, v] of Object.entries(week)) {
    tmp[getSorterForCurrentDay()[k]] = { key: k, value: v };
  }

  const orderedWeek: Week = {};
  tmp.forEach((obj) => {
    orderedWeek[obj.key] = obj.value;
  });

  return orderedWeek;
}

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  const day = ("0" + date.getDate()).slice(-2);
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date
  );
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const renderHours = (week: HoursDoc, c_specificDay: string|undefined) => {
  const dayDom: JSX.Element[] = [];
  let i = 0;
  for (const [k, v] of Object.entries(sortByDay(week))) {
    let dayDate: string | Date = new Date();

    if (i > 0) {
      dayDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
    }

    const data:Day|unknown = v
    const s = formatDate(dayDate);
    dayDate = s;
    dayDom.push(
      <DayRow
        key={k}
        dayDate={dayDate}
        dayName={k}
        day={data}
        isToday={isDayToday(k)}
        holidayhours={week.holidayHours}
        c_specificDay={c_specificDay}
      />
    );
    i++;
  }

  return <tbody className="font-normal">{dayDom}</tbody>;
};

function isDayToday(dayName: string) {
  return defaultSorter[dayName] === todayIndex;
}

type DayRow = {
  dayName: string;
  day: Day;
  isToday?: boolean;
  dayDate: string | Date;
  holidayhours: HolidayHours[] | undefined;
  c_specificDay: string|undefined;
};

type Holiday = {
  date: string;
};

type DataAccordingToMe = {
  // [key: string]: Holiday[]; // Array of Holiday objects
  [key: string]: Holiday[]
};

const DayRow = (props: DayRow) => {
  const { dayName, day, isToday, dayDate, holidayhours } = props;
  const [currentDay, setCurrentDay] = useState("");
  const [myDataAccordintToMe, setMyDataAccordintToMe]:[DataAccordingToMe, React.Dispatch<React.SetStateAction<DataAccordingToMe>>] = useState<DataAccordingToMe>({});
  let s, holidayDate: Date | string;

  const holidayarray: HolidayHours[] = [];
  const holidayopenintervals: Holiday[] = [];
  const keysFromData = holidayhours
    ? holidayhours?.map((holiday: HolidayHours) => {
        s = formatDate(new Date(holiday.date));
        holidayDate = s;
        holidayarray.push(holiday);
        return holidayDate;
      })
    : null;

  React.useEffect(() => {
    if (keysFromData) {
      const keysFromDataUnique = keysFromData.filter(
        (value: string, index: number, self: string[]) => {
          return self.indexOf(value) === index;
        }
      );

     
      const dataAccordintToMe: DataAccordingToMe={}
      for (let index = 0; index < keysFromDataUnique.length; index++) {
        const element:string = keysFromDataUnique[index];
        
        dataAccordintToMe[element] = holidayarray.filter((fe:{date:string}) => {
          const matchdate:string = formatDate(new Date(fe.date));
          return matchdate == element;
        });
      }
      setMyDataAccordintToMe(dataAccordintToMe);
    }
  }, []);

  let Status = false;
  for (const key in myDataAccordintToMe) {
    if (key == dayDate) {
      Status = true;
      holidayopenintervals.push(myDataAccordintToMe[key]);
    }
  }

  useEffect(() => {
    if (isToday) {
      setCurrentDay("currentDay");
    }
  }, []);
  return (
    <tr className={currentDay}>
      {Status ? (
        <td className="capitalize text-left  pl-1 pr-4">
          <span>{dayName.slice(0, 3)} </span>
        </td>
      ) : (
        <td className="DayName">
          <span>{dayName.slice(0, 3)}</span>
        </td>
      )}
      {!day.isClosed && (
        <td className="pr-2 mr-2">
          {Status
            ? holidayopenintervals &&
              holidayopenintervals?.map((res: HolidayHours[]) => {
                return res?.map((openint: HolidayHours) => {
                  return (
                    <>
                      {openint.isClosed ? (
                        <span className="inline closed-bx">
                          <span className="close_h">{StaticData.Closed}</span>
                          <span className="divider-h"> </span>
                          <span className="end-hrs "></span>
                        </span>
                      ) : (
                        openint?.openIntervals &&
                        openint?.openIntervals?.map(
                          (res: Interval) => {
                            return (
                              <>
                                <span className="inline">
                                  {" "}
                                  <span className="start-hrs">
                                    {OpenStausFunctions.formatTime(res.start)}
                                  </span>{" "}
                                  <span className="divider-h"> - </span>
                                  <span className="end-hrs ">
                                    {OpenStausFunctions.formatTime(res.end)}
                                  </span>
                                </span>
                              </>
                            );
                          }
                        )
                      )}
                    </>
                  );
                });
              })
            : day.openIntervals.map((res: { start: string; end: string }) => {
                return (
                  <>
                    <span className="inline">
                      {" "}
                      <span className="start-hrs">
                        {OpenStausFunctions.formatTime(res.start)}
                      </span>{" "}
                      <span className="divider-h"> - </span>
                      <span className="end-hrs ">
                        {OpenStausFunctions.formatTime(res.end)}
                      </span>{" "}
                    </span>
                  </>
                );
              })}
        </td>
      )}
      {day.isClosed &&
        (Status ? (
          <td className="pr-2 mr-2">
            {holidayopenintervals?.map((res: HolidayHours[]) => {
              return res?.map((openint: HolidayHours) => {
                return openint?.openIntervals?.map(
                  (res:Interval) => {
                    return (
                      <>
                        <span className="inline">
                          {" "}
                          <span className="start-hrs">
                            {OpenStausFunctions.formatTime(res.start)}
                          </span>{" "}
                          <span className="divider-h"> - </span>
                          <span className="end-hrs ">
                            {OpenStausFunctions.formatTime(res.end)}
                          </span>{" "}
                        </span>
                      </>
                    );
                  }
                );
              });
            })}
          </td>
        ) : (
          <td className="pr-2 closed-bx mr-2">
            <span className="inline">
              <span className="close_h">{StaticData.Closed}</span>
              <span className="divider-h"> </span>
              <span className="end-hrs "></span>
            </span>
          </td>
        ))}
    </tr>
  );
};

/***
 * for using the opening hours listing on the location details page
 * 
 */

const Hours = (props: Hours) => {
  let dateNewFormat;
  const { hours, additionalHoursText, c_specificDay } = props;
  return (
    <>
      <table className="day-hrs ">
        {hours && props?.reopenDate ? (
          <span>
            {additionalHoursText} <br />
            <span>
              {" "}
              {StaticData.tempClosed} {dateNewFormat}{" "}
            </span>
          </span>
        ) : (
          <>{renderHours(hours, c_specificDay)}</>
        )}
      </table>
    </>
  );
};

export default Hours;
