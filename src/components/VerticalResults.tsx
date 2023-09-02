/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from "classnames";
import {
  CompositionMethod,
  useComposedCssClasses,
} from "../hooks/useComposedCssClasses";
import { useSearchState, Result } from "@yext/search-headless-react";
import * as React from "react";
import { CardComponent } from "@yext/search-ui-react";

interface VerticalResultsCssClasses {
  container?: string;
  labelContainer?: string;
  label?: string;
  selectedLabel?: string;
  leftIconContainer?: string;
  rightIconContainer?: string;
  icon?: string;
  results___loading?: string;
}

const builtInCssClasses: VerticalResultsCssClasses = {
  results___loading: "opacity-50",
};

interface VerticalResultsDisplayProps {
  CardComponent: CardComponent;
  isLoading?: boolean;
  results: Result[];
  customCssClasses?: VerticalResultsCssClasses;
  cssCompositionMethod?: CompositionMethod;
}

export function VerticalResultsDisplay(
  props: VerticalResultsDisplayProps
): JSX.Element | null {
  const {
    CardComponent,
    results,
    isLoading = false,
    customCssClasses,
    cssCompositionMethod,
  } = props;
  const cssClasses = useComposedCssClasses(
    builtInCssClasses,
    customCssClasses,
    cssCompositionMethod
  );

  if (results.length === 0) {
    return null;
  }

  const resultsClassNames = classNames({
    [cssClasses.results___loading ?? ""]: isLoading,
  });

  return (
    <div className={resultsClassNames}>
      {results && renderResult(CardComponent, results)}
    </div>
  );
}

function renderResult(CardComponent: CardComponent, result: any): JSX.Element {
  return <CardComponent result={result} key={result.id || result.index} />;
}

interface VerticalResultsProps {
  CardComponent: any;
  cardConfig?: any;
  displayAllOnNoResults?: boolean;
  customCssClasses?: VerticalResultsCssClasses;
  cssCompositionMethod?: CompositionMethod;
  postalLoading?: boolean;
  allowPagination?: boolean;
  locationResults: any;
}

export default function VerticalResults(
  props: VerticalResultsProps
): JSX.Element | null {
  const { ...otherProps } = props;
  const verticalResults = props.locationResults || [];
  const isLoading = useSearchState((state) => state.searchStatus.isLoading);
  const results: any = verticalResults;

  return (
    <VerticalResultsDisplay
      results={results}
      isLoading={isLoading}
      {...otherProps}
    />
  );
}
