import {
  useSearchUtilities,
  DisplayableFacet,
  DisplayableFacetOption,
} from "@yext/search-headless-react";
import { useState } from "react";
import { useCollapse } from "react-collapsed";
import {
  CompositionMethod,
  useComposedCssClasses,
} from "../../hooks/useComposedCssClasses";
import renderCheckboxOption, {
  CheckboxOptionCssClasses,
} from "./utils/renderCheckboxOption";
import * as React from "react";

export type onFacetChangeFn = (
  fieldId: string,
  option: DisplayableFacetOption
) => void;

export interface FacetConfig {
  searchable?: boolean;
  placeholderText?: string;
  label?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface FacetProps extends FacetConfig {
  facet: DisplayableFacet;
  onToggle: onFacetChangeFn;
  customCssclasses?: FacetCssClasses;
  cssCompositionMethod?: CompositionMethod;
  checkBoxListRef:HTMLDivElement;
}

export interface FacetCssClasses extends CheckboxOptionCssClasses {
  label?: string;
  labelIcon?: string;
  labelContainer?: string;
  optionsContainer?: string;
  searchableInputElement?: string;
}

const builtInCssClasses: FacetCssClasses = {
  label: "text-green text-xl font-medium text-left w-full hidden",
  labelIcon: "w-3 mx-2",
  labelContainer: "heading-item",
  optionsContainer: "fillterList",
};

export default function Facet(props: FacetProps): JSX.Element {
  const {
    facet,
    onToggle,
    searchable,
    collapsible,
    defaultExpanded,
    label,
    placeholderText = "Search here...",
    customCssclasses,
    cssCompositionMethod,
    checkBoxListRef
  } = props;
  const cssClasses = useComposedCssClasses(
    builtInCssClasses,
    customCssclasses,
    cssCompositionMethod
  );
  const answersUtilities = useSearchUtilities();
  const hasSelectedFacet = !!facet.options.find((o) => o.selected);
  const [filterValue, setFilterValue] = useState("");
  const { getCollapseProps, getToggleProps } = useCollapse({
    defaultExpanded: hasSelectedFacet || defaultExpanded,
  });

  cssClasses.labelIcon = cssClasses.labelIcon ?? "";
  
  const facetOptions = searchable
    ? answersUtilities.searchThroughFacet(facet, filterValue).options
    : facet.options;

  return (
    <fieldset>
      <button
        className={cssClasses.labelContainer + " hidden"}
        {...(collapsible ? getToggleProps() : {})}
      >
        <span className={cssClasses.label}>{label || facet.displayName}</span>        
      </button>
      <div {...(collapsible ? getCollapseProps() : {})}>
        {searchable && (
          <input
            className={cssClasses.searchableInputElement}
            type="text"
            placeholder={placeholderText}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}           
          />
        )}
        <div className={cssClasses.optionsContainer} ref={checkBoxListRef}>
          {facetOptions.map((option) =>
            renderCheckboxOption({
              option: {
                id: option.displayName,
                label: `${option.displayName} `,
              },
              onClick: () => onToggle(facet.fieldId, option),
              selected: option.selected,
            })
          )}
        </div>
      </div>
    </fieldset>
  );
}
