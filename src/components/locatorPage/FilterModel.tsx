import * as React from "react";
import { useRef, useState } from "react";
import { StandardFacets } from "@yext/search-ui-react";
import {
  useSearchState,
  useSearchActions,
  Matcher,
  SelectableFilter,
} from "@yext/search-headless-react";
import { svgIcons } from "../../svg icons/svgIcon";
import Facets from "./Facets";
import constant from "../../constant";

const FilterModel = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const searchAction = useSearchActions();
  const latitude =
    useSearchState((state) => state.location.userLocation?.latitude) || 0;
  const longitude =
    useSearchState((state) => state.location.userLocation?.longitude) || 0;
  const [applyButtonStatus, setApplyButtonStatus] = React.useState(true);
  const selectInputRef = useRef<HTMLSelectElement>(null);

  const options = [
    { value: "1", label: "1 mile" },
    { value: "5", label: "5 miles" },
    { value: "10", label: "10 miles" },
    { value: "25", label: "25 miles" },
    { value: "50", label: "50 miles" },
    { value: "100", label: "100 miles" },
    { value: "200", label: "200 miles" },
  ];
  const [selectedMilesOption, setSelectedMilesOption] = useState(50);

  function updateParamradius(radius: number) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("r", constant.metersToMilesDecimal(radius).toString());
    const newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      searchParams.toString();
    window.history.replaceState({}, "", newUrl);
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMilesOption(parseInt(e.target?.value));
    const mileToMeter = parseInt(e.target?.value) * 1609.34;
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
    
    setApplyButtonStatus(false);
    e.target?.classList.add("changed");
    updateParamradius(mileToMeter);
    searchAction.setStaticFilters([locationFilter]);
  };

  const openModal = () => {
    setIsOpen(true);
    document.body.classList.add("filterModel");
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.classList.remove("filterModel");
    <StandardFacets searchOnChange={true} />;
  };

  const optionsHtml =
    options &&
    options.map((option) => {
      return (
        <option
          key={option.value}
          value={option.value}
          selected={selectedMilesOption.toString() == option.value}
        >
          {option.label}
        </option>
      );
    });

  return (
    <div className="filterButton">
      <div className="filterBtn">
        <button
          className="filter-button"
          title="Filter Button"
          onClick={openModal}
        >
          {svgIcons.filterIcon}
        </button>
      </div>

      <div        
        className={modalIsOpen ? "modalPopup modalShow" : "modalPopup"}
      >
        <div className="headFilter">
          <h2>Cafe Filters</h2>{" "}
          <button
            onClick={closeModal}
            type="button"
            id="closeButton"
            className="bg-closeIcon"
          >
            {svgIcons.CloseIcon}
          </button>
        </div>

        <div className="FilterMid">
          <div className="filter-distance">
            <h2>Filter by distance</h2>
            <select
              className=""
              id="distance-select-input"
              onChange={(e) => handleChange(e)}
              autoFocus={true}
              ref={selectInputRef}
            >
              {optionsHtml}
            </select>
          </div>
          <div className="filter-by-services">
            <h2>Filter by services</h2>
            <Facets
              applyButtonStatus={applyButtonStatus}
              setApplyButtonStatus={setApplyButtonStatus}
              searchOnChange={false}
              searchable={false}
              collapsible={true}
              defaultExpanded={true}
              handleCloseModal={closeModal}
              selectInputRef={selectInputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModel;
