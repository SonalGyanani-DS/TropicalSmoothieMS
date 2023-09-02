import * as React from "react";
import Hours from "../commons/hours";
import { StaticData } from "../../sites-global/staticData";
import Model from "./Model";
import { Link } from "@yext/pages/components";
import constant from "../../constant";
import { svgIcons } from "../../svg icons/svgIcon";
import { Address, Hours as HoursInterFace } from "../../types/search/locations";
import GetDirections from "../commons/GetDirections";
import homeCafeIcon from "../../images/home.svg";
import clockIcon from "../../images/clock.svg";

type data = {
  address?: Address;
  phone: string;
  hours: HoursInterFace;
  additionalHoursText: string;
  c_specific_day: string;
  googlePlaceId: string;
  crossStreetInfo: string;
  happyHoursText: string;
  hideUberCTA: boolean;
  name: string;
  latitude: number;
  longitude: number;
};

const Contact = (props: data) => {
  const {
    address,
    phone,
    hours,
    c_specific_day,
    additionalHoursText,
    googlePlaceId,
    crossStreetInfo,
    happyHoursText,
    hideUberCTA,
    latitude,
    longitude,
  } = props;

  let formattedAddress: string | "" = "";
  if (address?.line1) {
    formattedAddress += address?.line1;
  }
  if (address?.line2) {
    formattedAddress += ", " + address?.line2;
  }
  if (address?.city) {
    formattedAddress += ", " + address?.city;
  }
  if (address?.region) {
    formattedAddress += ", " + address?.region;
  }

  const apiUrl = `https://m.uber.com/ul/`;
  const url = new URL(apiUrl);
  url.searchParams.set("action", "setPickup");
  url.searchParams.set("client_id", "KXQcwoj2Zb8ymDzKgVgbIaDE5iAE_TAj");
  url.searchParams.set("dropoff[formatted_address]", formattedAddress);
  url.searchParams.set("dropoff[latitude]", String(latitude));
  url.searchParams.set("dropoff[longitude]", String(longitude));
  url.searchParams.set("dropoff[nickname]", "Tropical Smoothie Cafe");
  url.searchParams.set("pickup", "my_location");
  const uberUrl = url.href;

  return (
    <>
      <div className="address-main-sec">
        <h4 className="box-title"><img src={homeCafeIcon} />CAFE INFO</h4>
        <div className="icon-row content-col">
          <div className="  address-text notHighlight">
            {address?.line1 ? <p>{address.line1}</p> : ""}
            {address?.line2 ? <p>{address.line2}</p> : ""}
            {address?.city}, {address?.region} {address?.postalCode}
          </div>
        </div>
        {crossStreetInfo ? (
          <div className="NAP-crossStreet">{crossStreetInfo}</div>
        ) : (
          ""
        )}
        {phone ? (
          <div className="icon-row">
            <div className="content-col">
              <Link
                href={`tel:${phone}`}
                data-ya-track={"phone"}
                eventName={"phone"}
                rel="noopener noreferrer"
                className="location-phn"
                id="address"
              >
                {constant.formattedNumber(phone)}
              </Link>
            </div>
          </div>
        ) : (
          ""
        )}
        <ul className="">
          <li className="direction-button">
            <GetDirections
              googlePlaceId={googlePlaceId}
              address={address}
              className={"Link btn notHighligh"}
              label={"Get Directions"}
            />
          </li>
        </ul>
        {!hideUberCTA ? (
          <div className="c-uber NAP-button NAP-uber">
            {svgIcons.uberIcon}{" "}
            <Link
              target="_blank"
              href={uberUrl}
              data-ya-track={"uberUrl"}
              eventName={"uberUrl"}
              rel="noopener noreferrer"
              className="location-phn"
            >
              Get a ride
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>

      {hours && typeof hours.monday != "undefined" ? (
        <div className="hours">
          <div className="hours-sec">
            <div className="title-with-link-1 one">
              <h4 className="box-title"><img src={clockIcon} />{"CAFE HOURS"}</h4>
            </div>
            <div className="hours-div mb-5 md:mb-1 flex flex-col">
              {hours.holidayHours && typeof hours.reopenDate == "undefined" ? (
                <>
                  <Model
                    name={StaticData.Holdiay}
                    holidayHours={hours.holidayHours}
                    c_specific_day={c_specific_day}
                  />
                </>
              ) : (
                ""
              )}
              {hours && (
                <Hours
                  title={"Cafe Hours"}
                  additionalHoursText={additionalHoursText}
                  hours={hours}
                  c_specificDay={c_specific_day}
                />
              )}
            </div>
            {additionalHoursText ? (
              <div className="Cafe-hours-locAddInfo-top">
                {additionalHoursText}
              </div>
            ) : (
              ""
            )}
            {happyHoursText ? (
              <div className="Cafe-hours-locAddInfo-top">{happyHoursText}</div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Contact;
