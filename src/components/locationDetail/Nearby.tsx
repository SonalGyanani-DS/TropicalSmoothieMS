import * as React from "react";
import OpenClose from "../commons/openClose";
import { Link } from "@yext/pages/components";
import "@splidejs/react-splide/css";
import {
  geoSearchEndpoint,
  stagingBaseurl,
  yextApiKey,
} from "../../sites-global/global";
import constant from "../../constant";
import { useEffect, useState } from "react";

type NearbyAPIConfig = {
  endpoint: string;
  params: {
    api_key: string;
    entityTypes?: string;
    limit?: string;
    radius?: string;
    savedFilterIds?: string;
    v: string;
  };
};

const getConfig = (api_key: string): NearbyAPIConfig => {
  return {
    endpoint: geoSearchEndpoint,
    params: {
      api_key,
      entityTypes: "location",
      limit: "4",
      radius: "500",
      savedFilterIds: "1297849413",
      v: "20220927",
    },
  };
};

type NearbyProps = {
  c_nearbyTitile?: string;
  c_viewmoreCta?: string;
  geocodedCoordinate: { latitude: number; longitude: number };
  id: string;
};

interface Location {
  name: string;
  slug?: string;
  id: string;
  address: {
    city: string;
    line1?: string;
    region: string;
  };
  c_crossStreetInfo?: string;
  hours?: {
    today: {
      start: string;
      end: string;
    }[];
  };
  timezone: string;
}

const Nearby = (props: NearbyProps) => {
  const { c_nearbyTitile, c_viewmoreCta, geocodedCoordinate, id } = props;

  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (!geocodedCoordinate) {
      return;
    }

    const config = getConfig(yextApiKey);
    const searchParams = new URLSearchParams({
      ...config.params,
      location: `${geocodedCoordinate.latitude},${geocodedCoordinate.longitude}`,
      filter: JSON.stringify({ "meta.id": { "!$eq": `${id}` } }),
    });

    fetch(`${config.endpoint}?${searchParams.toString()}`)
      .then((resp) => resp.json())
      .then((data) => setNearbyLocations(data.response.entities || []))
      .catch((error) => console.error(error));
  }, [geocodedCoordinate, id]);

  if (!nearbyLocations.length) {
    return null;
  }

  return (
    <div className="nearby-sec">
      <div className="container-narrow">
        <div className="sec-title">
          <h2 className="">{c_nearbyTitile}</h2>
        </div>
        <div className="nearby-sec-inner">
          {nearbyLocations.map((location: Location, index: number) => {
            let url = "";
            if (!location.slug) {
              let finalresult: string | undefined = "";
              if (typeof location.address.line1 != "undefined") {
                finalresult += location.address.line1;
              }
              if (finalresult) {
                finalresult = constant.slugify(finalresult);
              } else {
                finalresult = constant.slugify(location.id);
              }
              url = `${constant.slugify(
                location.address.region
              )}/${constant.slugify(location.address.city)}/${finalresult}`;
            } else {
              url = `${constant.slugify(
                location.address.region
              )}/${constant.slugify(location.address.city)}/${constant.slugify(
                location.slug
              )}`;
            }

            if (index > 0) {
              return (
                <div className="nearby-card" key={location.name}>
                  <div className="nearby-card1">
                    <div className="location-name-miles icon-row">
                      <h2>
                        <Link
                          className="inline-block notHighlight"
                          href={"/" + url}
                          data-ya-track={"businessname"}
                          eventName={"businessname"}
                          rel="noopener noreferrer"
                        >
                          {location.name} {location.address.city}
                        </Link>
                      </h2>
                    </div>

                    <div className="icon-row closeing-div">
                      {location.hours ? (
                        <div
                          className="flex open-now-string items-center "
                          data-id={`main-shop-${location.id}`}
                        >
                          <OpenClose
                            timezone={location.timezone}
                            hours={location.hours}
                            deliveryHours={location.hours}
                            id={location.id}
                          ></OpenClose>
                        </div>
                      ) : (
                        <div className="closeddot notHighlight red-dot">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="8"
                            height="8"
                            viewBox="0 0 8 8"
                          >
                            <circle
                              id="Ellipse_5"
                              data-name="Ellipse 5"
                              cx="4"
                              cy="4"
                              r="4"
                              fill="#ad1e1f"
                            />
                          </svg>
                          <div className="hours-info text-lg font-second-main-font closeddot">
                            Closed
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="icon-row content-col">
                      <div className="address notHighlight ">
                        <div className="address_1 notHighlight">
                          <div>
                            {location.address.line1 ? (
                              <p>{location.address.line1}</p>
                            ) : (
                              ""
                            )}
                            {location.c_crossStreetInfo ? (
                              <div className="NAP-crossStreet">
                                {location.c_crossStreetInfo}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="content-center w-full text-center nearby-cta">
          <Link
            href={stagingBaseurl}
            className="button-red"
            data-ya-track={`visitlocator`}
            eventName={`visitlocator`}
            rel="noopener noreferrer"
          >
            {c_viewmoreCta}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Nearby;
