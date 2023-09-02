import { useSearchActions } from "@yext/search-headless-react";
import { useRef, useState } from "react";
import * as React from "react";
import LocationCard from "./LocationCard";
import { useSearchState } from "@yext/search-headless-react";
import {
  AnswerExperienceConfig,
  center_latitude,
  center_longitude,
  mapboxAccessToken,
  stagingBaseurl,
} from "../../sites-global/global";
import { StaticData } from "../../sites-global/staticData";
import ViewMore from "./ViewMore";
import VerticalResults from "../VerticalResults";
import ResultsCount from "./ResultsCount";
import useFetchResults from "../../hooks/useFetchResults";
import useGetPostalCodeLatLng from "../../hooks/useGetPostalCodeLatLng";
import constant from "../../constant";
import { MapboxMap } from "../../components/locatorPage/mapbox/MapboxMap";
import "mapbox-gl/dist/mapbox-gl.css";
import { SearchContextProvider } from "./SearchContextProvider";
import FilterSearch from "./FilterSearch";
import useDimensions from "../../hooks/useDimensions";
import { StandardCard } from "@yext/search-ui-react";

const params1 = { latitude: center_latitude, longitude: center_longitude };
const SearchLayout = (props:any): JSX.Element => {
  const locationResults = useFetchResults() || [];
  const [inputvalue, setInputValue] = React.useState("");
  const [postalLoading, setPostalLoading] = useState(false);
  const [checkallowed, setCheckAllowed] = useState(false);
  const { postalcode } = useGetPostalCodeLatLng();
  const [allowresult, setAllowResult] = useState(false);
  const searchActions = useSearchActions();
  const loading = useSearchState((s) => s.searchStatus.isLoading);
  const [displaySearchKey, setDisplaySearchKey] = useState<string>("");
  const locationListRef = useRef<HTMLDivElement>(null);
  /**
   * set search messages
   *
   */
  let searchMessageDefault = `<p>Use our locator to find a location near you!</p>`;
  searchMessageDefault += `<p>Search by city and state or ZIP code or <a class="underline font-bold" href=${stagingBaseurl} >browse all locations</a>.</p>`;
  const [searchMessage, setSearchMessage] =
    React.useState<string>(searchMessageDefault);

  const { width } = useDimensions();

  function updateParam(latestUserInput: string) {
    const paramValue = latestUserInput; // Replace with your updated value
    const radius = constant.metersToMilesDecimal(
      AnswerExperienceConfig.locationRadius
    );
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("q", paramValue);
    searchParams.set("r", String(radius));
    const newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      searchParams.toString();
    window.history.replaceState({}, "", newUrl);
  }

  async function getCoordinates(address: string, updateradius: number) {
    if (address !== "") {
      setInputValue(address);
      setPostalLoading(true);
      postalcode(address, params1, checkallowed, updateradius);
    } else {
      const setDefaultState = {
        ...searchActions.state,
        vertical: {
          ...searchActions.state.vertical,
          results: [],
          resultsCount: 0,
        },
      };
      searchActions.setState(setDefaultState);
    }
  }

  return (
    <SearchContextProvider>
      <div className="locator-main">
        <div className="left-section">
          <div className="search-bx">
            <div className="location-with-filter">
              <h1 className="">{StaticData.FindLocationtext}</h1>
              <br />
              <h4>Search by city and state or ZIP code</h4>
            </div>
            <div className="search-main">
              <FilterSearch
                customCssClasses={{
                  filterSearchContainer: "",
                  inputElement: "FilterSearchInput",
                }}
                searchOnSelect={true}
                searchFields={[
                  {
                    entityType: "location",
                    fieldApiName: "address.city",
                  },
                  {
                    entityType: "location",
                    fieldApiName: "address.region",
                  },
                  {
                    entityType: "location",
                    fieldApiName: "address.countryCode",
                  },
                  {
                    entityType: "location",
                    fieldApiName: "address.postalCode",
                  },
                ]}
                setAllowResult={setAllowResult}
                inputValue={inputvalue}
                updateParam={updateParam}
                setCheckAllowed={setCheckAllowed}
                checkallowed={checkallowed}
                getCoordinates={getCoordinates}
                placeholder="e.g, San Francisco, CA"
                onlyAllowDropdownOptionSubmissions={true}
                setSearchMessage={setSearchMessage}
                setDisplaySearchKey={setDisplaySearchKey}
                displaySearchKey={displaySearchKey}
                screenReaderInstructions={""}
                screenReaderText={""}
                locationResults={locationResults}
              />
            </div>
          </div>

          <div className="breadcrumb">
            <div className="container-custom">
              <ul>
                <li>
                  <a href={stagingBaseurl} className="home">
                    All Locations
                  </a>
                </li>
                <li>{StaticData.locator_breadcrumb}</li>
              </ul>
            </div>
          </div>

          {!loading && locationResults.length > 0 && (
            <ResultsCount
              customCssClasses={{
                container: "my-0 text-dark-gray pt-5 sm:pt-0",
              }}
              allowresult={allowresult}
              displaySearchKey={displaySearchKey}
            />
          )}

          <div className="left-listing">
            <div className="scrollbar-container" ref={locationListRef}>
              <div>
                <VerticalResults
                  displayAllOnNoResults={false}
                  CardComponent={LocationCard}
                  postalLoading={postalLoading}
                  locationResults={locationResults}
                  customCssClasses={{
                    container:
                      "result-list flex flex-col scroll-smooth  overflow-auto",
                  }}
                />
                {locationResults.length === 0 && (
                  <div className="browse-dir home ">
                    <div dangerouslySetInnerHTML={{ __html: searchMessage }} />
                  </div>
                )}
                <div className="button-bx">
                  <ViewMore
                    className={
                      " btn notHighlight lg:!w-[132%] !mb-2 button view-more"
                    }
                    idName={"view-more-button"}
                    buttonLabel={"View More"}
                  />
                </div>
                {locationResults.length > 10 && (
                  <div className="back-to-top">
                    <a href="#body">Back to top</a>
                  </div>
                )}
              </div>
            </div>
            {/* )} */}
          </div>
        </div>
        <div className="right-section">
          {width > 1023 ? (
            <MapboxMap
              mapboxAccessToken={mapboxAccessToken}
              meta={props.meta}
              _site={props._site}
              locationResults={locationResults}
              locationListRef={locationListRef}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </SearchContextProvider>
  );
};

export default SearchLayout;
