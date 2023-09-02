import { useEffect, useRef, useState } from "react";
import {
  useSearchActions,
  FilterSearchResponse,
  SearchParameterField,
  Filter,
  useSearchState,
  Matcher,
  SelectableFilter,
} from "@yext/search-headless-react";
import InputDropdown, { InputDropdownCssClasses } from "./InputDropdown";
import DropdownSection, {
  DropdownSectionCssClasses,
  Option,
} from "./DropdownSection";
// import { processTranslation } from "./utils/processTranslation";
import { useSynchronizedRequest } from "../../hooks/useSynchronizedRequest";
import { AutocompleteResultCssClasses } from "./utils/renderAutocompleteResult";
import {
  CompositionMethod,
  useComposedCssClasses,
} from "../../hooks/useComposedCssClasses";
import {
  AnswerExperienceConfig,
  search_icn,
  stagingBaseurl,
  UseMylocationsvg,
  googleApikey,
  regionNameByCode,
} from "../../sites-global/global";
import * as React from "react";
import FilterModel from "./FilterModel";
import Geocode from "react-geocode";

interface FilterSearchCssClasses
  extends InputDropdownCssClasses,
    DropdownSectionCssClasses,
    AutocompleteResultCssClasses {
  container?: string;
  label?: string;
}

const builtInCssClasses: FilterSearchCssClasses = {
  container: "mb-2",
  label: "mb-4 text-sm font-medium text-gray-900",
  dropdownContainer:
    "absolute z-10 shadow-lg rounded-md border border-gray-300 bg-white pt-3 pb-1 px-4 mt-1",
  inputElement:
    "text-sm bg-white outline-none h-9 w-full p-2 rounded-md border border-gray-300 focus:border-blue-600",
  sectionContainer: "pb-2",
  sectionLabel: "text-sm text-gray-700 font-semibold pb-2",
  focusedOption: "bg-gray-100",
  option: "text-sm text-gray-700 pb-1 cursor-pointer",
};

export interface FilterSearchProps {
  label: string;
  sectioned: boolean;
  searchFields: Omit<SearchParameterField, "fetchEntities">[];
  customCssClasses?: FilterSearchCssClasses;
  cssCompositionMethod?: CompositionMethod;
  inputValue?: string;
  placeholder?: string;
  screenReaderText: string;
  renderSearchButton?: () => JSX.Element | null;
  cssClasses?: InputDropdownCssClasses;
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

interface resultOption {
  value: string;
  key: string;
  relatedItem: {
    rawData: {
      address: {
        city: string;
        region: string;
        countryCode: string;
        postalCode: string;
      };
    };
  };
}

export default function FilterSearch({
  sectioned,
  searchFields,
  customCssClasses,
  cssCompositionMethod,
  inputValue = "",
  placeholder,
  renderSearchButton = () => null,
  setDisplaymsg,
  getCoordinates,
  setCheckAllowed,
  updateParam,
  setSearchMessage,
  setDisplaySearchKey,
  displaySearchKey,
  locationResults,
  checkallowed,
}: FilterSearchProps): JSX.Element {
  const searchAction = useSearchActions();
  const [input, setInput] = useState(inputValue);
  const selectedFilterOptionRef = useRef<Filter | null>(null);
  const searchParamFields = searchFields.map((searchField) => {
    return { ...searchField, fetchEntities: true };
  });

  const [allowLocation, setallowLocation] = React.useState("");
  const verticalResults =
    useSearchState((state) => state.vertical?.results) || [];
  const [locationinbuit] = useState(verticalResults);
  const queryInput = useSearchState((state) => state.query.input) || "";
  const loading = useSearchState((s) => s.searchStatus.isLoading);
 
  const cssClasses = useComposedCssClasses(
    builtInCssClasses,
    customCssClasses,
    cssCompositionMethod
  );

  const [filterSearchResponse, executeFilterSearch] = useSynchronizedRequest<
    string,
    FilterSearchResponse
  >((inputValue) =>
    searchAction.executeFilterSearch(
      inputValue ?? "",
      sectioned,
      searchParamFields
    )
  );

  const getOptionValue = (result: resultOption) => {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    let filterSearchValue = result.value;
    let filterSearchValueSearchKey = result.value;
    // let filterSearchValue = "";
    // let filterSearchValueSearchKey = "";
    if (result.relatedItem?.rawData.address) {
      const address = result.relatedItem?.rawData.address;
      if (result.key == "address.city") {
        filterSearchValue = `${address?.city}, ${
          regionNameByCode[address?.region]
        }, ${regionNames.of(address.countryCode)}`;
        filterSearchValueSearchKey = `${address?.city}, ${address?.region}`;
      } else if (result.key == "address.region") {
        filterSearchValue = `${
          regionNameByCode[address?.region]
        }, ${regionNames.of(address.countryCode)}`;
        filterSearchValueSearchKey = `${address?.region}`;
      } else if (result.key == "address.postalCode") {
        filterSearchValue = `${address?.city}, ${
          regionNameByCode[address?.region]
        }, ${address?.postalCode}, ${regionNames.of(address.countryCode)}`;
        filterSearchValueSearchKey = `${address?.city}, ${address?.region}`;
      }
    } else {
      if (result.key == "address.city") {
        filterSearchValue = `${result.value}`;
        filterSearchValueSearchKey = `${result.value}`;
      } else if (result.key == "address.region") {
        filterSearchValue = `${regionNameByCode[result.value]}`;
        filterSearchValueSearchKey = `${result.value}`;
      } else {
        filterSearchValue = `${result.value}`;
        filterSearchValueSearchKey = `${result.value}`;
      }
    }
    return {
      filterSearchValue: filterSearchValue,
      filterSearchValueSearchKey: filterSearchValueSearchKey,
    };
  };

  let sections: { results: Option[]; label?: string }[] = [];

  if (filterSearchResponse) {
    sections = filterSearchResponse.sections.map((section) => {
      const uniqueArray: string[] = [];
      const filterSectionResults = section.results.map((result) => {
        const { filterSearchValue, filterSearchValueSearchKey } =
          getOptionValue(result);
        if (
          !uniqueArray.includes(filterSearchValue) &&
          filterSearchValue !== ""
        ) {
          uniqueArray.push(filterSearchValue);
          return {
            value: filterSearchValue,
            onSelect: () => {
              setInput(filterSearchValue);
              if (result?.filter) {
                if (selectedFilterOptionRef.current) {
                  searchAction.setFilterOption({
                    ...selectedFilterOptionRef.current,
                    selected: false,
                  });
                }
                selectedFilterOptionRef.current = result.filter;
                searchAction.setFilterOption({
                  ...result.filter,
                  selected: true,
                });
                setDisplaySearchKey(filterSearchValueSearchKey);
                onEnterSubmit(filterSearchValue);
              }
            },
            display: filterSearchValue,
          };
        } else {
          return null;
        }
      });

      return {
        results: filterSectionResults,
        label: section.label,
      };
    });
  }

  sections = sections.filter((section) => section.results.length > 0);

  const searchResults = () => {
    const searchKey: string | undefined = input;
    if (searchKey) {
      getCoordinates(searchKey, 50);
      updateParam(searchKey);
    }

    if (locationinbuit.length == 0 && !loading && searchKey != "") {
      getFormatedAddress(searchKey).then((formatAddres: string) => {
        if (searchKey === "") {
          setSearchMessage(
            `<p>Please enter a search location or <a href=${stagingBaseurl} >browse our directory</a>.</p>`
          );
        } else if (searchKey != "" && locationResults.length <= 0) {
          const searchLocationKey = queryInput ? queryInput : searchKey;
          let showMessage = `<p>Sorry, there are no locations near "${
            formatAddres ? formatAddres : searchLocationKey
          }" satisfying the selected filters.`;
          showMessage += ` Please modify your search and try again or <a href=${stagingBaseurl} >browse all locations.</a></p>`;
          setSearchMessage(showMessage);
        }
      });

      setDisplaymsg && setDisplaymsg(true);
    } else {
      if (searchKey) {
        onLoadSetMessage(searchKey);
      }
      setDisplaymsg && setDisplaymsg(false);
    }
  };

  const onEnterSubmit = (value: string) => {
    setDisplaymsg && setDisplaymsg(false);
    setallowLocation("");

    setCheckAllowed && setCheckAllowed(false);
    searchAction.setQuery(value);
    getCoordinates(value, 50);
    updateParam(value);

    let messagesValue = displaySearchKey;
    if (locationinbuit.length == 0) {
      messagesValue = value;
    }
    if (value) {
      onLoadSetMessage(value);
    }

    if (locationinbuit.length == 0 && !loading && value != "") {
      getFormatedAddress(value).then((formatAddres: string) => {
        if (value === "") {
          setSearchMessage(
            `<p>Please enter a search location or <a href=${stagingBaseurl} >browse our directory</a>.</p>`
          );
        } else if (value != "" && locationResults.length <= 0) {
          const searchLocationKey = queryInput ? queryInput : value;
          let showMessage = `<p>Sorry, there are no locations near "${
            formatAddres ? formatAddres : searchLocationKey
          }" satisfying the selected filters.`;
          showMessage += ` Please modify your search and try again or <a href=${stagingBaseurl} >browse all locations.</a></p>`;
          setSearchMessage(showMessage);
        }
      });
    } else {
      if (value) {
        onLoadSetMessage(value);
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
                setInput(formatAddress);
                setDisplaySearchKey(formatAddressMessage);
                searchAction.setQuery(formatAddress);
                searchAction.setVertical("locations");
                searchAction.setUserLocation(params);
                searchAction.setOffset(0);
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
                searchAction.setStaticFilters([locationFilter]);
                searchAction.executeVerticalQuery();
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
          setInput(latitude + "," + longitude);
          setDisplaySearchKey(formatAddressMessage);
          searchAction.setQuery(formatAddress);
          searchAction.setVertical("locations");
          searchAction.setUserLocation(params);
          searchAction.setOffset(0);
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
          searchAction.setStaticFilters([locationFilter]);
          searchAction.executeVerticalQuery();
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
        if (input !== currentValue) {
          if (currentValue !== "" && currentValue !== null) {
            searchAction.setQuery(currentValue);
            if (!checkallowed) {
              setInput(currentValue);
            }
            if (currentValue) {
              onLoadSetMessage(currentValue);
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

  const onLoadSetMessage = (value: string) => {
    let formatAddressMessage = "";
    Geocode.setApiKey(googleApikey);
    Geocode.fromAddress(value).then(
      async (response: GeocodeResponse) => {
        if (
          typeof response !== "undefined" &&
          response.status !== "ZERO_RESULTS" &&
          response.results[0]
        ) {
          for (
            let i = 0;
            i < response.results[0].address_components.length;
            i++
          ) {
            const type = response.results[0].address_components[i].types[0];
            if (type.includes("locality")) {
              formatAddressMessage +=
                response.results[0].address_components[i].long_name;
            }
            if (type.includes("administrative_area_level_1")) {
              formatAddressMessage +=
                ", " + response.results[0].address_components[i].short_name;
            }
          }
          if (formatAddressMessage) {
            setDisplaySearchKey(formatAddressMessage);
          }
        }
      },
      (error: string) => {
        // console.log(error);
      }
    );
  };

  const getFormatedAddress = (searchKey: string) => {
    return new Promise((resolve, reject) => {
      Geocode.setApiKey(googleApikey);
      Geocode.fromAddress(searchKey).then(
        async (response: GeocodeResponse) => {
          if (
            typeof response !== "undefined" &&
            response.status !== "ZERO_RESULTS" &&
            response.results[0]
          ) {
            let formatAddressMessage = "";
            for (
              let i = 0;
              i < response.results[0].address_components.length;
              i++
            ) {
              const type = response.results[0].address_components[i].types[0];
              if (type.includes("locality")) {
                formatAddressMessage +=
                  response.results[0].address_components[i].long_name;
              }
              if (type.includes("administrative_area_level_1")) {
                formatAddressMessage +=
                  ", " + response.results[0].address_components[i].short_name;
              }
            }
            if (formatAddressMessage) {
              return resolve(formatAddressMessage);
            } else {
              return reject("SOMETHING WENT WRONG");
            }
          }
        },
        (error: string) => {
          reject(error);
        }
      );
    });
  };

  return (
    <>
      <div className="search-field">
        <div className="mb-2 w-full">
          <div className="locator-find-block">
            <div className="search-form">
              <div className="mapbox-autocomplete-container">
                <InputDropdown
                  inputValue={input}
                  placeholder={placeholder}
                  onInputChange={(newInput: string) => {
                    setInput(newInput);
                  }}
                  onInputFocus={(input: string) => {
                    executeFilterSearch(input);
                  }}
                  cssClasses={cssClasses}
                  onEnterSubmit={onEnterSubmit}
                >
                  {sections.map((section, sectionIndex) => {
                    const sectionId = section.label
                      ? `${section.label}-${sectionIndex}`
                      : `${sectionIndex}`;

                    const options = section.results.filter((result) => {
                      if (result !== null && result.value !== "") {
                        return result;
                      }
                    });

                    return (
                      <React.Fragment key={sectionIndex}>
                        <ul id="mapbox_autocomplete-list">
                          <DropdownSection
                            key={sectionId}
                            options={options}
                            optionIdPrefix={sectionId}
                            onFocusChange={(value) => {
                              setInput(value);
                            }}
                            label={section.label}
                            cssClasses={cssClasses}
                          />
                        </ul>
                      </React.Fragment>
                    );
                  })}
                </InputDropdown>
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
      </div>{" "}
    </>
  );
}
