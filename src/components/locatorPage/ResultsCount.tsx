import { useSearchState } from "@yext/search-headless-react";
import * as React from "react";
import {
  CompositionMethod,
  useComposedCssClasses,
} from "../../hooks/useComposedCssClasses";

interface ResultsCountCssClasses {
  container?: string;
  text?: string;
  number?: string;
}

const builtInCssClasses: ResultsCountCssClasses = {
  container: "",
  text: "CountList",
  number: "font-medium",
};

interface ResultsCountProps {
  customCssClasses?: ResultsCountCssClasses;
  cssCompositionMethod?: CompositionMethod;
  displaySearchKey: string;
  allowresult: boolean;
}

export default function ResultsCount({
  customCssClasses,
  cssCompositionMethod,
  displaySearchKey,
  allowresult,
}: ResultsCountProps): JSX.Element | null {
  let resultsLength =
    useSearchState((state) => state.vertical?.results?.length) || 0;
  const allResultsForVertical =
    useSearchState(
      (state) =>
        state.vertical?.noResults?.allResultsForVertical.results?.length
    ) || 0;
  const verticalResultsCount =
    useSearchState((state) => state.vertical.resultsCount) || 0;

  if (verticalResultsCount == 0) {
    resultsLength = allResultsForVertical;
  }
  const loading = useSearchState((s) => s.searchStatus.isLoading);

  const cssClasses = useComposedCssClasses(
    builtInCssClasses,
    customCssClasses,
    cssCompositionMethod
  );

  if (resultsLength === 0) {
    return null;
  }
  const id: HTMLCollectionOf<Element> =
    document.getElementsByClassName("FilterSearchInput");
  let message!: string;

  if (id.length > 0) {
    message = (id[0] as HTMLInputElement).value;
  }

  const locationString = resultsLength > 1 ? "locations" : "location";
  const searchString = displaySearchKey ? displaySearchKey : message;
  const messageString = resultsLength + " " + locationString + ' near "' + searchString + '"';

  return (
    <div className={cssClasses.container}>
      {!loading &&
        verticalResultsCount != 0 &&
        !allowresult  && (
          <span className={builtInCssClasses.text}>{messageString}</span>
        )}
    </div>
  );
}
