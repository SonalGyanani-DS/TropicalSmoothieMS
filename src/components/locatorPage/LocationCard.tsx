import * as React from "react";
import Address from "../commons/Address";
import OpenClose from "../commons/openClose";
import { StaticData } from "../../sites-global/staticData";
import { Link } from "@yext/pages/components";
import "react-loading-skeleton/dist/skeleton.css";
import constant from "../../constant";
import { LocationResultData } from "../../types";
import GetDirections from "../commons/GetDirections";
import { useContext } from "react";
import { SearchContext } from "./SearchContextProvider";

export type LocationCardProps = {
  result: LocationResultData[];
};

const LocationCard = (props: LocationCardProps) => {
  return props.result.map((result: LocationResultData, keyindex: number) => {
    const { id, slug, address } = result.rawData;
    const addressCity = address.city;
    const shopName = result.rawData.name + " " + addressCity;

    const { hoverLocation, clickLocation, setHoverLocation, setClickLocation } = useContext(SearchContext);

    let url = "";
    if (!slug) {
      let finalresult: string | undefined = "";
      if (typeof address.line1 != "undefined") {
        finalresult += address.line1;
      }
      if (finalresult) {
        finalresult = constant.slugify(finalresult);
      } else {
        finalresult = constant.slugify(id);
      }
      url = `${constant.slugify(address.region)}/${constant.slugify(
        address.city
      )}/${finalresult}`;
    } else {
      url = `${constant.slugify(address.region)}/${constant.slugify(
        address.city
      )}/${constant.slugify(slug)}`;
    }

    const handleMouseOver =()=>{
      if(clickLocation !== id){
        setHoverLocation(id);
      }      
    }

    const handleOnClick =()=>{
      setHoverLocation("");
      setClickLocation(id);
    }

    let gridClass = "";
    if(hoverLocation === id){
      gridClass = "active";
    }
    if(clickLocation === id ){
      gridClass += " fixed-hover";
    }
    
    return (
      <div
        className={`location result-list-inner-${keyindex + 1} result ${gridClass}`}
        id={`result-${keyindex + 1}`}
        key={keyindex}
        onMouseOver={handleMouseOver}
        onClick={handleOnClick}
      >
        <div className="numbring">{`${keyindex + 1}`}</div>
        <div className="result-inner ">
          <div className="center-column">
            <div className="lp-param-results lp-subparam-hours">
              <div className="location-name-miles icon-row">
                <h2>
                  {/* <Link
                    className="inline-block notHighlight"
                    data-ya-track={`businessname`}
                    eventName={`businessname`}
                    rel="noopener noreferrer"
                    href={url}
                  > */}
                    {shopName}
                  {/* </Link> */}
                </h2>
                <div className="distance">
                  {typeof result.distance != "undefined" && (
                    <div className="">
                      {constant.metersToMiles(result.distance)}{" "}
                      <span>{StaticData.miles}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="icon-row content-col address-with-availablity">
                <div className="mt-2">
                  {result.rawData.hours?.reopenDate ? (
                    <div
                      className="cursor-pointer flex open-now-string items-center "
                      data-id={`main-shop-${result.rawData.id}`}
                    >
                      {StaticData.tempClosed}
                    </div>
                  ) : (
                    <div
                      className={
                        " notHighlight flex open-now-string items-center"
                      }
                      data-id={`main-shop-${result.rawData.id}`}
                    >
                      <OpenClose
                        timezone={result.rawData.timezone}
                        hours={result.rawData.hours}
                        id={result.rawData.id}
                      />
                    </div>
                  )}
                </div>
                <Address address={address} />
              </div>
              <div className="button-bx">
                <GetDirections
                  googlePlaceId={result.rawData.googlePlaceId}
                  address={address}
                  className={""}
                  label={"Get Directions"}
                />                
                {/* <Link
                  href={url}
                  data-ya-track={"visitpage"}
                  eventName={"visitpage"}
                  rel="noopener noreferrer"
                >
                  Visit Website
                </Link> */}
                {/* <Link
                  href={result.rawData.orderUrl.url}
                  data-ya-track={"cta"}
                  eventName={"cta"}
                  rel="noopener noreferrer"
                > */}
                  Order online
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
};

export default LocationCard;
