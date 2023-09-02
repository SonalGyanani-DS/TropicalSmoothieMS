import {
  useSearchState,
  useSearchActions,
  DisplayableFacetOption,
  SelectableFilter,
  Matcher,
} from "@yext/search-headless-react";
import {
  CompositionMethod,
  useComposedCssClasses,
} from "../../hooks/useComposedCssClasses";
import Facet, { FacetCssClasses } from "./Facet";
import { Divider } from "./staticFilters";
import {
  AnswerExperienceConfig,
  servicesFilterOptions,
} from "../../sites-global/global";
import * as React from "react";
import constant from "../../constant";
import { useEffect, useRef } from "react";
type OptionType = {
  displayName: string;
  count?: number;
  selected?: boolean;
  matcher?: string;
  value: string;
  key?: string;
  fieldId?: string;
};

type FacetOptionsType = {
  fieldId: string;
  displayName: string;
  options: OptionType[];
};

type OptionKeyType = {
  displayName: string;
  value: string;
};

type ServiceOptionType = {
  key: string;
  value: string;
};

interface FacetsProps {
  searchOnChange?: boolean;
  searchable?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  facetConfigs?: Record<string, FacetOptionsType>;
  customCssClasses?: FacetsCssClasses;
  cssCompositionMethod?: CompositionMethod;
  handleCloseModal: () => void;
  applyButtonStatus: boolean;
  setApplyButtonStatus: (value: boolean) => void;
  selectInputRef:HTMLSelectElement;
}

interface FacetsCssClasses extends FacetCssClasses {
  container?: string;
  divider?: string;
  buttonsContainer?: string;
  button?: string;
}

const builtInCssClasses: FacetsCssClasses = {
  searchableInputElement: "filter-popup",
  container: "md:w-full",
  buttonsContainer: "",
  button: " Link btn",
  divider: "w-full h-px bg-gray-200 my-4",
};
export default function Facets(props: FacetsProps): JSX.Element {
  const {
    searchOnChange,
    searchable,
    collapsible,
    defaultExpanded,
    facetConfigs = {},
    customCssClasses,
    cssCompositionMethod,
    handleCloseModal,
    applyButtonStatus,
    setApplyButtonStatus,
    selectInputRef
  } = props;

  const checkBoxListRef = useRef<HTMLDivElement>(null);

  const cssClasses = useComposedCssClasses(
    builtInCssClasses,
    customCssClasses,
    cssCompositionMethod
  );

  const latitude =
    useSearchState((state) => state.location.userLocation?.latitude) || 0;
  const longitude =
    useSearchState((state) => state.location.userLocation?.longitude) || 0;

  const searchAction = useSearchActions();

  const executeSearch = () => {
    searchAction.setOffset(0);
    searchAction.setVerticalLimit(AnswerExperienceConfig.limit);

    if (searchAction.state.filters.static == undefined) {
      const mileToMeter = 50 * 1609.34;
      const locationFilter: SelectableFilter = {
        selected: true,
        fieldId: "builtin.location",
        value: {
          lat: latitude,
          lng: longitude,
          radius: mileToMeter,
        },
        matcher: Matcher.Near,
      };
      searchAction.setStaticFilters([locationFilter]);
      constant.updateParamradius(mileToMeter);
    }

    customFacetsObjects.map((facetOptions) => {
      facetOptions.options.map((facetOption: OptionType) => {
        if (facetOption.selected) {
          customOptionsKeys.map((option: OptionType) => {
            if (facetOption.displayName == option.displayName) {
              constant.addFilterParams(option.value);
            }
          });
        }
      });
    });

    searchAction.executeVerticalQuery();
    handleCloseModal();
  };
  const handleResetFacets = () => {
    // searchAction.setStaticFilters([]);
    const resetOptions: OptionType[] = [];
    customFacetsObjects.map((facetOptions: FacetOptionsType) => {
      facetOptions.options.map((facetOption: OptionType) => {
        resetOptions.push({
          displayName: facetOption.value,
          count: 10,
          selected: false,
          matcher: "$eq",
          value: facetOption.value,
        });
      });
    });
    const resetCustomFacets = [
      {
        fieldId: "c_locationPageServices",
        displayName: "Location Page Services",
        options: resetOptions,
      },
    ];
    setCustomFacetsObjects(resetCustomFacets);
    searchAction.resetFacets();
    executeSearch();
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("features");
    const newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      searchParams.toString();
    window.history.replaceState({}, "", newUrl);
    handleCloseModal();
  };

  // const [applyButtonStatus, setApplyButtonStatus] = React.useState(true);
  // applyButtonStatus
  // setApplyButtonStatus
  const [customFacetsObjects, setCustomFacetsObjects] = React.useState<
    FacetOptionsType[]
  >([]);
  const [customOptionsKeys, setCustomOptionsKeys] = React.useState<
    OptionKeyType[]
  >([]);

  const [onLoadSetFacets, setOnLoadSetFacets] = React.useState(false);

  let customFacets: FacetOptionsType[] = [];

  if (typeof servicesFilterOptions != "undefined") {
    const options: OptionType[] = [];
    const optionsKeys: OptionKeyType[] = [];
    servicesFilterOptions.map(
      (filterOption: { value: string; key: string }) => {
        if (
          filterOption.value != "Vegetarian Friendly" &&
          filterOption.value != "Gluten Friendly"
        ) {
          options.push({
            displayName: filterOption.value,
            count: 0,
            selected: false,
            matcher: "$eq",
            value: filterOption.value,
          });
          optionsKeys.push({
            displayName: filterOption.value,
            value: filterOption.key,
          });
        }
      }
    );
    if (options.length > 0) {
      const optionsSort = options.sort(function (
        a: { displayName: string },
        b: { displayName: string }
      ) {
        if (a.displayName < b.displayName) {
          return -1;
        }
        if (a.displayName > b.displayName) {
          return 1;
        }
        return 0;
      });
      customFacets = [
        {
          fieldId: "c_locationPageServices",
          displayName: "Location Page Services",
          options: optionsSort,
        },
      ];
    }
    if (customFacetsObjects.length <= 0) {
      setCustomFacetsObjects(customFacets);
      setCustomOptionsKeys(optionsKeys);
      searchAction.setFacets(customFacets);
    }
  }

  const handleFacetOptionChange = (
    fieldId: string,
    option: DisplayableFacetOption
  ) => {
    if (
      typeof searchAction.state.filters.facets === "undefined" &&
      searchAction.state.filters.facets == undefined
    ) {
      // searchAction.setFacets(customFacetsObjects);
    }
    searchAction.setFacets(customFacetsObjects);

    searchAction.setFacetOption(fieldId, option, !option.selected);
    let resetCustomFacets: FacetOptionsType[] = [];
    const resetOptions: OptionType[] = [];
    customFacetsObjects.map((facetOptions: FacetOptionsType) => {
      facetOptions.options.map((facetOption: OptionType) => {
        if (facetOption.displayName == option.displayName) {
          resetOptions.push({
            displayName: facetOption.value,
            count: option.count,
            selected: !option.selected,
            matcher: "$eq",
            value: facetOption.value,
          });
        } else {
          resetOptions.push(facetOption);
        }
      });
    });
    resetCustomFacets = [
      {
        fieldId: "c_locationPageServices",
        displayName: "Location Page Services",
        options: resetOptions,
      },
    ];
    setCustomFacetsObjects(resetCustomFacets);

    let checkedValue = false;
        
    for (let i = 0; checkBoxListRef.current?.children[i]; ++i) {
      if (checkBoxListRef.current?.children[i].children[0].checked) {
        checkedValue = true;
        break;
      }
    }

    if (checkedValue) {
      setApplyButtonStatus(false);
    } else { 
      const distanceSelectInput = selectInputRef.current;
      if (!distanceSelectInput.classList.contains("changed")) {
        setApplyButtonStatus(true);
      }
    }
    if (searchOnChange) {
      executeSearch();
    }
  };

  let facetComponents;
  const facets = customFacetsObjects;
  if (facets.length > 0) {
    facetComponents = facets
      .filter((facet: FacetOptionsType) => facet.options?.length > 0)
      .map(
        (
          facet: FacetOptionsType,
          index: number,
          facetArray: FacetOptionsType[]
        ) => {
          const isLastFacet = index === facetArray.length - 1;
          const overrideConfig = facetConfigs?.[facet.fieldId] ?? {};
          const config = {
            searchable,
            collapsible,
            defaultExpanded,
            ...overrideConfig,
          };
          return (
            <div key={facet.fieldId}>
              <Facet
                facet={facet}
                {...config}
                customCssclasses={cssClasses}
                onToggle={handleFacetOptionChange}
                checkBoxListRef={checkBoxListRef}
              />
              {!isLastFacet && (
                <Divider
                  customCssClasses={{ divider: cssClasses.divider }}
                  cssCompositionMethod="replace"
                />
              )}
            </div>
          );
        }
      );
  }

  useEffect(() => {
    if (!onLoadSetFacets) {
      if (
        typeof searchAction.state.filters.facets === "undefined" &&
        searchAction.state.filters.facets == undefined
      ) {
        searchAction.setFacets(customFacetsObjects);
        const urlParams = new URLSearchParams(window.location.search);
        const searchFeatures = urlParams.getAll("features");
        if (searchFeatures.length > 0) {
          servicesFilterOptions.map(
            (servicesFilterOption: ServiceOptionType) => {
              if (searchFeatures.includes(servicesFilterOption.key)) {
                const option = {
                  displayName: servicesFilterOption.value,
                  count: 10,
                  selected: true,
                  matcher: Matcher.Equals,
                  value: servicesFilterOption.value,
                };
                searchAction.setFacetOption(
                  "c_locationPageServices",
                  option,
                  true
                );
              }
            }
          );
        }
      }
      setOnLoadSetFacets(true);
    }
  }, []);

  return (
    <div className={cssClasses.container + " filter-items"}>
      <div>{facetComponents}</div>
      <div className={cssClasses.buttonsContainer + " filterButtons button-bx"}>
        <button onClick={handleResetFacets} className={cssClasses.button}>
          Reset all
        </button>
        {!searchOnChange && (
          <button
            onClick={executeSearch}
            className={cssClasses.button}
            //disabled={true}
            disabled={applyButtonStatus}
            id="apply-button"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}
