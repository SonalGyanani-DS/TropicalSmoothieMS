import {
  useSearchActions,
  useSearchState,
  Matcher,
  SelectableFilter,
} from "@yext/search-headless-react";
import {
  mapboxAccessToken,
  search_icn,
  stagingBaseurl,
  UseMylocationsvg,
  googleApikey,
  AnswerExperienceConfig,
} from "../../sites-global/global";
import * as React from "react";
import { KeyboardEvent, useRef, useEffect, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import useDebounce from "../../hooks/useDebounce";
import Geocode from "react-geocode";
import FilterModel from "./FilterModel";

export interface InputDropdownCssClasses {
  inputDropdownContainer?: string;
  inputDropdownContainer___active?: string;
  dropdownContainer?: string;
  filterSearchContainer?: string;
  inputElement?: string;
  inputContainer?: string;
  divider?: string;
  logoContainer?: string;
  searchButtonContainer?: string;
}

interface Props {
  inputValue?: string;
  placeholder?: string;
  screenReaderInstructions: string;
  screenReaderText: string;
  onlyAllowDropdownOptionSubmissions?: boolean;
  forceHideDropdown?: boolean;
  onSubmit?: (value: string) => void;
  renderSearchButton?: () => JSX.Element | null;
  renderLogo?: () => JSX.Element | null;
  onDropdownLeave?: (value: string) => void;
  cssClasses?: InputDropdownCssClasses;
  handleSetUserShareLocation: (value: string, userShareStatus: boolean) => void;
  setDisplaySearchKey: (value: string) => void;
  displaySearchKey: string;
  setCheckAllowed?: (value: boolean) => void;
  getCoordinates: (address: string, updateradius: number) => void;
  setDisplaymsg?: (value: boolean) => void;
  updateParam: (value: string) => void;
  setErrorStatus?: (value: boolean) => void;
  setSearchMessage: (value: string) => void;
  setAllowResult: (value: boolean) => void;
  locationResults: [];
  checkallowed: boolean;
}

type SuggestionType = {
  text: string;
  context: { short_code: string; text: string; id: string[] }[];
  place_type: string[];
  properties: { short_code: string };
  place_name: string;
};

interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
}

interface GeocodeResult {
  address_components: GeocodeAddressComponent[];
  formatted_address: string;
  geometry: GeocodeGeometry;
  place_id: string;
  types: string[];
}

interface GeocodeAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeGeometry {
  location: {
    lat: number;
    lng: number;
  };
  location_type: string;
  viewport: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
}

export default function MapBoxInput({
  inputValue = "",
  placeholder,
  renderSearchButton = () => null,
  cssClasses = {},
  setDisplaymsg,
  getCoordinates,
  setCheckAllowed,
  updateParam,
  setSearchMessage,
  setDisplaySearchKey,
  locationResults,
  checkallowed,
}: React.PropsWithChildren<Props>): JSX.Element | null {
  const [allowLocation, setallowLocation] = React.useState("");
  const [latestUserInput, setLatestUserInput] = useState(inputValue);
  const verticalResults =
    useSearchState((state) => state.vertical?.results) || [];
  const [locationinbuit] = useState(verticalResults);
  const loading = useSearchState((s) => s.searchStatus.isLoading);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchActions = useSearchActions();
  const queryInput = useSearchState((state) => state.query.input) || "";
  const [inputArrowClass, setInputArrowClass] = React.useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentValue: string | null = urlParams.get("q");
    const updateRadius: string | null = urlParams.get("r");

    if (currentValue) {
      const [latitude, longitude] = currentValue.split(",");
      const latitudeFloat = parseFloat(latitude);
      const longitudeFloat = parseFloat(longitude);

      if (!isNaN(latitudeFloat) && !isNaN(longitudeFloat) && !checkallowed) {
        getLocationFromLatLong(latitudeFloat, longitudeFloat);
      } else {
        if (latestUserInput !== currentValue) {
          if (currentValue !== "" && currentValue !== null) {
            searchActions.setQuery(currentValue);
            if (!checkallowed) {
              console.log(
                `Latitude:`,
                latestUserInput,
                currentValue,
                checkallowed
              );
              setLatestUserInput(currentValue);
              if (currentValue) {
                onLoadSetMessage(currentValue);
              }
            }
            getCoordinates(
              currentValue,
              updateRadius ? parseInt(updateRadius) : 0
            );
          }
          // Do something with the updated value, such as update a form field or make an API call
        }
      }
    }
  }, [checkallowed]);

  const debounceValue = useDebounce(latestUserInput);

  useEffect(() => {
    if (debounceValue) {
      searchLocations(debounceValue);
    }
    return () => {
      setMapboxSuggestions([]);
    };
  }, [debounceValue]);

  const searchResults = () => {
    const searchKey: string | undefined = inputRef.current?.value;
    if (searchKey) {
      getCoordinates(searchKey, 50);
      updateParam(searchKey);
    }

    if (locationinbuit.length == 0 && !loading && searchKey != "") {
      if (searchKey === "") {
        setSearchMessage(
          `<p>Please enter a search location or <a href=${stagingBaseurl} >browse our directory</a>.</p>`
        );
      } else if (searchKey != "" && locationResults.length <= 0) {
        const searchLocationKey = queryInput ? queryInput : searchKey;
        let showMessage = `<p>Sorry, there are no locations near "${searchLocationKey}" satisfying the selected filters.`;
        showMessage += ` Please modify your search and try again or <a href="index.html">browse all locations.</a></p>`;
        setSearchMessage(showMessage);
      }
      setDisplaymsg && setDisplaymsg(true);
    } else {
      setDisplaymsg && setDisplaymsg(false);
    }
  };

  const [mapboxSuggestions, setMapboxSuggestions] = React.useState<
    SuggestionType[]
  >([]);
  const [showList, setShowList] = React.useState<boolean>(false);

  const [suggestionIndex, setSuggestionIndex] = useState<number | null>(null);

  const searchLocations = (value: string) => {
    if (value) {
      const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json`;
      const url = new URL(apiUrl);
      url.searchParams.set("access_token", mapboxAccessToken);
      url.searchParams.set("country", "us");
      const searchUrl = url.href;
      fetch(searchUrl)
        .then((res) => res.json())
        .then(async (response) => {
          if (response && response.features.length > 0) {
            setMapboxSuggestions(response.features);
            setInputArrowClass("input-focus");
          } else {
            setInputArrowClass("");
            setMapboxSuggestions([]);
          }
        })
        .catch((error) => {
          console.log("Something went wrong with mapbox search api", error);
        });
    }
  };

  const onLoadSetMessage = (value: string) => {
    if (value) {
      const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json`;
      const url = new URL(apiUrl);
      url.searchParams.set("access_token", mapboxAccessToken);
      url.searchParams.set("country", "us");
      const searchUrl = url.href;
      fetch(searchUrl)
        .then((res) => res.json())
        .then(async (response) => {
          if (response && response.features.length > 0) {
            const searchKeyMessage = parseReverseGeo(response.features[0]);
            setDisplaySearchKey(searchKeyMessage);
          }
        })
        .catch((error) => {
          console.log("Something went wrong with mapbox search api", error);
        });
    }
  };

  const parseReverseGeo = (geoData: SuggestionType) => {
    let region = "";
    let addressString = "";
    if (!geoData) {
      return addressString;
    }
    let address = geoData.text;
    if (geoData.context) {
      geoData.context.forEach(
        (v: { short_code: string; text: string; id: string[] }) => {
          if (v.id.includes("region")) {
            region = v.short_code;
          }

          if (v.id.includes("place")) {
            address = v.text;
          }
        }
      );
    }
    if (geoData.place_type.includes("region")) {
      region = geoData.properties.short_code;
    }

    if (geoData.place_type.includes("region")) {
      addressString = region.replace("US-", "");
    } else {
      addressString = address + ", " + region.replace("US-", "");
    }

    return addressString;
  };

  const onInputKeyDown = (event: KeyboardEvent) => {
    setDisplaymsg && setDisplaymsg(false);
    setallowLocation("");
    handleKeyDown(event);
    if (event.key === "Enter") {
      event.preventDefault();
      setCheckAllowed && setCheckAllowed(false);
      setShowList(false);
      let selectedSuggetion: SuggestionType | null = null;
      let place_name = "";

      if (suggestionIndex !== null) {
        selectedSuggetion = mapboxSuggestions[suggestionIndex];
        place_name = selectedSuggetion.place_name;
        setLatestUserInput(selectedSuggetion.place_name);
      }

      searchActions.setQuery(place_name ? place_name : latestUserInput);
      getCoordinates(place_name ? place_name : latestUserInput, 50);
      updateParam(place_name ? place_name : latestUserInput);

      if (selectedSuggetion) {
        setDisplaySearchKey(parseReverseGeo(selectedSuggetion));
      } else {
        onLoadSetMessage(latestUserInput);
      }
      if (place_name) {
        setSuggestionIndex(null);
      } else if (latestUserInput === "") {
        setSearchMessage(
          `<p>Please enter a search location or <a href=${stagingBaseurl} >browse our directory</a>.</p>`
        );
      } else if (latestUserInput !== "") {
        let showMessage = `<p>Sorry, there are no locations near "${latestUserInput}" satisfying the selected filters.`;
        showMessage += ` Please modify your search and try again or <a href=${stagingBaseurl} >browse all locations.</a></p>`;
        setSearchMessage(showMessage);
      }
      inputRef.current?.blur();
    }
  };

  const onOptionSelect = (data: SuggestionType) => {
    setallowLocation("");
    setCheckAllowed && setCheckAllowed(false);
    const displaySearchKeyWord = parseReverseGeo(data);
    setDisplaySearchKey(displaySearchKeyWord);
    searchActions.setQuery(displaySearchKeyWord);
    setLatestUserInput(data.place_name);
    setDisplaySearchKey(data.place_name);
    if (data.place_name) {
      getCoordinates(data.place_name, 50);
      updateParam(data.place_name);
      setDisplaySearchKey(displaySearchKeyWord);
    }
    const mapboxSearchKey: string | undefined = inputRef.current?.value;
    if (mapboxSearchKey === "") {
      setSearchMessage(
        `<p>Please enter a search location or <a href=${stagingBaseurl} >browse our directory</a>.</p>`
      );
    } else if (mapboxSearchKey !== "") {
      const searchLocationKey = displaySearchKeyWord
        ? displaySearchKeyWord
        : mapboxSearchKey;
      let showMessage = `<p>Sorry, there are no locations near "${searchLocationKey}" satisfying the selected filters.`;
      showMessage += ` Please modify your search and try again or <a href=${stagingBaseurl} >browse all locations.</a></p>`;
      setSearchMessage(showMessage);
    }
  };

  const inputWrapperRef = useRef(null);
  useOutsideClick(showList, inputWrapperRef, () => setShowList(false));

  const handleKeyDown = (e: KeyboardEvent) => {
    // UP ARROW
    if (e.keyCode === 38) {
      if (!suggestionIndex || suggestionIndex === 0) {
        setSuggestionIndex(mapboxSuggestions.length - 1);
      } else {
        setSuggestionIndex(suggestionIndex - 1);
      }
    }
    // DOWN ARROW
    else if (e.keyCode === 40) {
      if (suggestionIndex === null) {
        setSuggestionIndex(0);
      } else if (suggestionIndex + 1 >= mapboxSuggestions.length) {
        setSuggestionIndex(0);
      } else {
        setSuggestionIndex(suggestionIndex + 1);
      }
    }
  };

  const onClickUserMyLocation = () => {
    let formatAddress = "";
    let formatAddressMessage = "";
    if (navigator.geolocation) {
      const error = (error: { code: number }) => {
        if (error.code == 1) {
          setallowLocation("Please allow your Location");
          setCheckAllowed && setCheckAllowed(false);
        }
      };

      navigator.geolocation.getCurrentPosition(
        function (position) {
          Geocode.setApiKey(googleApikey);
          Geocode.fromLatLng(
            position.coords.latitude,
            position.coords.longitude
          ).then(
            async (response: GeocodeResponse) => {
              if (response.results[0]) {
                console.log("response.results[0]", response.results[0]);
                for (
                  let i = 0;
                  i < response.results[0].address_components.length;
                  i++
                ) {
                  const type =
                    response.results[0].address_components[i].types[0];
                  if (type.includes("administrative_area_level_2")) {
                    formatAddress +=
                      response.results[0].address_components[i].long_name;
                    formatAddressMessage +=
                      response.results[0].address_components[i].long_name;
                  }
                  if (type.includes("administrative_area_level_1")) {
                    formatAddress +=
                      ", " +
                      response.results[0].address_components[i].short_name;
                    formatAddressMessage +=
                      ", " +
                      response.results[0].address_components[i].short_name;
                  }

                  if (type.includes("postal_code")) {
                    formatAddress +=
                      " " + response.results[0].address_components[i].long_name;
                  }
                }

                setallowLocation("");
                setCheckAllowed && setCheckAllowed(true);

                const params = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                setLatestUserInput(formatAddress);
                setDisplaySearchKey(formatAddressMessage);
                searchActions.setQuery(formatAddress);
                searchActions.setVertical("locations");
                searchActions.setUserLocation(params);
                searchActions.setOffset(0);
                const locationFilter: SelectableFilter = {
                  selected: true,
                  fieldId: "builtin.location",
                  value: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    radius: AnswerExperienceConfig.locationRadius,
                  },
                  matcher: Matcher.Near,
                };
                searchActions.setStaticFilters([locationFilter]);
                searchActions.executeVerticalQuery();
                const searchParams = new URLSearchParams(
                  window.location.search
                );
                searchParams.set(
                  "q",
                  position.coords.latitude + "," + position.coords.longitude
                );
                searchParams.set("r", String(50));
                const newUrl =
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  window.location.pathname +
                  "?" +
                  searchParams.toString();
                window.history.replaceState({}, "", newUrl);
                if (formatAddressMessage != "" && locationinbuit.length <= 0) {
                  let showMessage = `<p>Sorry, there are no locations near "${formatAddressMessage}" satisfying the selected filters.`;
                  showMessage += ` Please modify your search and try again or <a href=${stagingBaseurl} >browse all locations.</a></p>`;
                  setSearchMessage(showMessage);
                }
              }
            },
            (error: string) => {
              console.error(error);
              setCheckAllowed && setCheckAllowed(false);
            }
          );
        },
        error,
        {
          timeout: 10000,
        }
      );
    }
  };

  const getLocationFromLatLong = (latitude: number, longitude: number) => {
    let formatAddress = "";
    let formatAddressMessage = "";
    Geocode.setApiKey(googleApikey);
    Geocode.fromLatLng(latitude, longitude).then(
      async (response: GeocodeResponse) => {
        if (response.results[0]) {
          for (
            let i = 0;
            i < response.results[0].address_components.length;
            i++
          ) {
            const type = response.results[0].address_components[i].types[0];
            if (type.includes("administrative_area_level_2")) {
              formatAddress +=
                response.results[0].address_components[i].long_name;
              formatAddressMessage +=
                response.results[0].address_components[i].long_name;
            }
            if (type.includes("administrative_area_level_1")) {
              formatAddress +=
                ", " + response.results[0].address_components[i].short_name;
              formatAddressMessage +=
                ", " + response.results[0].address_components[i].short_name;
            }

            if (type.includes("postal_code")) {
              formatAddress +=
                " " + response.results[0].address_components[i].long_name;
            }
          }
          setallowLocation("");
          const params = {
            latitude: latitude,
            longitude: longitude,
          };
          setLatestUserInput(latitude + "," + longitude);
          setDisplaySearchKey(formatAddressMessage);
          searchActions.setQuery(formatAddress);
          searchActions.setVertical("locations");
          searchActions.setUserLocation(params);
          searchActions.setOffset(0);
          const locationFilter: SelectableFilter = {
            selected: true,
            fieldId: "builtin.location",
            value: {
              lat: latitude,
              lng: longitude,
              radius: AnswerExperienceConfig.locationRadius,
            },
            matcher: Matcher.Near,
          };
          searchActions.setStaticFilters([locationFilter]);
          searchActions.executeVerticalQuery();
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("q", latitude + "," + longitude);
          searchParams.set("r", String(50));
          const newUrl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?" +
            searchParams.toString();
          window.history.replaceState({}, "", newUrl);
          if (formatAddressMessage != "" && locationinbuit.length <= 0) {
            let showMessage = `<p>Sorry, there are no locations near "${formatAddressMessage}" satisfying the selected filters.`;
            showMessage += ` Please modify your search and try again or <a href=${stagingBaseurl} >browse all locations.</a></p>`;
            setSearchMessage(showMessage);
          }
        }
      },
      (error: string) => {
        console.error(error);
        setCheckAllowed && setCheckAllowed(false);
      }
    );
  };

  return (
    <>
      <div className="search-field">
        <div className="mb-2 w-full">
          <div className="locator-find-block">
            <div className="search-form">
              <div
                className="mapbox-autocomplete-container"
                ref={inputWrapperRef}
              >
                <input
                  id="mapbox_autocomplete"                  
                  className={inputArrowClass + " FilterSearchInput"}
                  placeholder={placeholder}
                  onKeyDown={onInputKeyDown}
                  value={latestUserInput}
                  onFocus={() => setShowList(true)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setLatestUserInput(e.target.value);
                    setDisplaySearchKey(e.target.value);
                    setShowList(true);
                  }}
                  // onBlur={() => setShowList(false)}
                  ref={inputRef}
                  autoComplete="off"
                />
                {showList && mapboxSuggestions.length > 0 && (
                  <ul id="mapbox_autocomplete-list">
                    {mapboxSuggestions.map(
                      (item: SuggestionType, index: number) => {
                        return (
                          <li
                            className={
                              index === suggestionIndex ? "active" : ""
                            }
                            key={index}
                            onClick={() => {
                              onOptionSelect(item);
                              setShowList(false);
                            }}
                          >
                            {item.place_name}
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
              </div>
              <div className={cssClasses.searchButtonContainer}>
                {renderSearchButton()}
              </div>
            </div>
            {allowLocation.length > 0 && (
              <div className="for-allow">{allowLocation}</div>
            )}
          </div>

          <button
            className="search-btn"
            aria-label="Search bar icon"
            id="search-location-button"
            type="button"
            onClick={() => {
              searchResults();
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: search_icn }} />
          </button>
        </div>
      </div>
      <div className="fliter-sec block">
        <button
          className="useMyLocation"
          title="Search using your current location!"
          id="useLocation"
          onClick={onClickUserMyLocation}
          type="button"
        >
          <span
            className="icon"
            dangerouslySetInnerHTML={{ __html: UseMylocationsvg }}
          />
        </button>
        <FilterModel />
      </div>
    </>
  );
}
