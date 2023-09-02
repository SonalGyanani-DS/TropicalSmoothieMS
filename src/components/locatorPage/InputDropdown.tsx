import classNames from "classnames";
import React, {
  useReducer,
  KeyboardEvent,
  useRef,
  useEffect,
  useState,
  useMemo,
  FocusEvent,
  Children,
} from "react";
import DropdownSection, { DropdownSectionProps } from "./DropdownSection";
import recursivelyMapChildren from "./utils/recursivelyMapChildren";
import { v4 as uuid } from "uuid";

export interface InputDropdownCssClasses {
  inputDropdownContainer?: string;
  inputDropdownContainer___active?: string;
  dropdownContainer?: string;
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
  onEnterSubmit?: (value: string) => void;
  onInputChange: (value: string) => void;
  onInputFocus: (value: string) => void;
  onDropdownLeave?: (value: string) => void;
  cssClasses?: InputDropdownCssClasses;
  handleSetUserShareLocation: (value: string, userShareStatus: boolean) => void;
  handleInputValue: () => void;
}

interface State {
  focusedSectionIndex?: number;
  dropdownHidden: boolean;
}

type Action =
  | { type: "HideSections" }
  | { type: "ShowSections" }
  | { type: "FocusSection"; newIndex?: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HideSections":
      return { focusedSectionIndex: undefined, dropdownHidden: true };
    case "ShowSections":
      return { focusedSectionIndex: undefined, dropdownHidden: false };
    case "FocusSection":
      return { focusedSectionIndex: action.newIndex, dropdownHidden: false };
  }
}

/**
 * A controlled input component with an attached dropdown.
 */

export default function InputDropdown({
  inputValue = "",
  placeholder,
  onlyAllowDropdownOptionSubmissions,
  forceHideDropdown,
  children,
  onEnterSubmit = () => null,
  onInputChange,
  onInputFocus,
  onDropdownLeave,
  cssClasses = {},
}: React.PropsWithChildren<Props>): JSX.Element | null {
  const [{ focusedSectionIndex, dropdownHidden }, dispatch] = useReducer(
    reducer,
    {
      focusedSectionIndex: undefined,
      dropdownHidden: true,
    }
  );
  const shouldDisplayDropdown = !dropdownHidden && !forceHideDropdown;

  const [focusedOptionId, setFocusedOptionId] = useState<string | undefined>(
    undefined
  );
  const [latestUserInput, setLatestUserInput] = useState(inputValue);
  const [childrenKey, setChildrenKey] = useState(0);

  const [keyUpStatus, setKeyUpStatus] = useState(true);

  const screenReaderInstructionsId = useMemo(() => uuid(), []);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputDropdownRef = useRef<HTMLDivElement>(null);
  const [inputArrowClass, setInputArrowClass] = React.useState("");

  let numSections = 0;
  const childrenWithProps = recursivelyMapChildren(children, (child) => {
    if (!(React.isValidElement(child) && child.type === DropdownSection)) {
      return child;
    }
    const currentSectionIndex = numSections;
    numSections++;

    const childProps = child.props as DropdownSectionProps;
    const modifiedOptions = childProps.options.map((option) => {
      const modifiedOnSelect = () => {
        setLatestUserInput(option.value);
        dispatch({ type: "HideSections" });
        option.onSelect?.();
      };
      return { ...option, onSelect: modifiedOnSelect };
    });

    const modifiedOnFocusChange = (value: string, focusedOptionId: string) => {
      child.props.onFocusChange?.(value, focusedOptionId);
      setFocusedOptionId(focusedOptionId);
    };

    if (focusedSectionIndex === currentSectionIndex) {
      return React.cloneElement(child, {
        onLeaveSectionFocus,
        options: modifiedOptions,
        isFocused: true,
        key: `${currentSectionIndex}-${childrenKey}`,
        onFocusChange: modifiedOnFocusChange,
      });
    } else {
      return React.cloneElement(child, {
        onLeaveSectionFocus,
        options: modifiedOptions,
        isFocused: false,
        key: `${currentSectionIndex}-${childrenKey}`,
      });
    }
  });

  /**
   * Handles changing which section should become focused when focus leaves the currently-focused section.
   * @param pastSectionEnd Whether the section focus left from the end or the beginning of the section.
   */
  function onLeaveSectionFocus(pastSectionEnd: boolean) {
    if (focusedSectionIndex === undefined && pastSectionEnd) {
      dispatch({ type: "FocusSection", newIndex: 0 });
    } else if (focusedSectionIndex !== undefined) {
      let newSectionIndex: number | undefined = pastSectionEnd
        ? focusedSectionIndex + 1
        : focusedSectionIndex - 1;
      if (newSectionIndex < 0) {
        newSectionIndex = undefined;
        onInputChange(latestUserInput);
        onDropdownLeave?.(latestUserInput);
      } else if (newSectionIndex > numSections - 1) {
        newSectionIndex = numSections - 1;
      }
      dispatch({ type: "FocusSection", newIndex: newSectionIndex });
    }
  }

  function handleDocumentClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    if (
      !(
        target.isSameNode(inputRef.current) ||
        dropdownRef.current?.contains(target)
      )
    ) {
      dispatch({ type: "HideSections" });
    }
  }

  function handleDocumentKeydown(evt: globalThis.KeyboardEvent) {
    if (["ArrowDown", "ArrowUp"].includes(evt.key)) {
      evt.preventDefault();
    }

    if (evt.key === "Escape") {
      dispatch({ type: "HideSections" });
    } else if (
      evt.key === "ArrowDown" &&
      numSections > 0 &&
      focusedSectionIndex === undefined
    ) {
      dispatch({ type: "FocusSection", newIndex: 0 });
    }
  }

  function handleDocumentKeyUp(evt: KeyboardEvent<HTMLInputElement>) {
    if (evt.key === "Backspace" || evt.key === "x" || evt.key === "Delete") {
      if (inputValue == "") {
        if (keyUpStatus) {
          onEnterSubmit(inputValue);
          setKeyUpStatus(false);
        }
      }
    }
    if (inputValue != "") {
      setKeyUpStatus(true);
    }
  }

  useEffect(() => {
    if (shouldDisplayDropdown) {
      document.addEventListener("click", handleDocumentClick);
      document.addEventListener("keydown", handleDocumentKeydown);
      return () => {
        document.removeEventListener("click", handleDocumentClick);
        document.removeEventListener("keydown", handleDocumentKeydown);
      };
    }
  });

  function handleInputElementKeydown(evt: KeyboardEvent<HTMLInputElement>) {
    if (["ArrowDown", "ArrowUp"].includes(evt.key)) {
      evt.preventDefault();
    }

    if (
      evt.key === "Enter" &&
      focusedSectionIndex === undefined &&
      !onlyAllowDropdownOptionSubmissions
    ) {
      setLatestUserInput(inputValue);
      onEnterSubmit(inputValue);
      dispatch({ type: "HideSections" });
    }
  }

  function handleBlur(evt: FocusEvent<HTMLDivElement>) {
    if (
      !evt.relatedTarget ||
      !(evt.relatedTarget instanceof HTMLElement) ||
      !inputDropdownRef.current
    ) {
      return;
    }
    if (!inputDropdownRef.current.contains(evt.relatedTarget)) {
      dispatch({ type: "HideSections" });
    }
  }

  const inputDropdownContainerCssClasses = classNames(
    cssClasses.inputDropdownContainer,
    {
      [cssClasses.inputDropdownContainer___active ?? ""]: shouldDisplayDropdown,
    }
  );

  return (
    <div
      className={inputDropdownContainerCssClasses}
      ref={inputDropdownRef}
      onBlur={handleBlur}
    >
      <div className={cssClasses?.inputContainer}>
        <input
          className={cssClasses.inputElement + " " + inputArrowClass}
          placeholder={placeholder}
          onChange={(evt) => {
            const value = evt.target.value;
            onInputChange(value);
            onInputFocus(value);
            setChildrenKey(childrenKey + 1);
            dispatch({ type: "ShowSections" });
            if (Children.count(children) > 0) {
              setInputArrowClass("input-focus");
            } else {
              setInputArrowClass("");
            }
          }}
          onClick={() => {
            onInputFocus(inputValue);
            setChildrenKey(childrenKey + 1);
            dispatch({ type: "ShowSections" });
            if (Children.count(children) > 0) {
              setInputArrowClass("input-focus");
            } else {
              setInputArrowClass("");
            }
          }}
          onFocus={() => {
            if (Children.count(children) > 0) {
              setInputArrowClass("input-focus");
            } else {
              setInputArrowClass("");
            }
          }}
          onKeyDown={handleInputElementKeydown}
          onKeyUp={handleDocumentKeyUp}
          value={inputValue}
          ref={inputRef}
          aria-describedby={screenReaderInstructionsId}
          aria-activedescendant={focusedOptionId}
        />
      </div>
      {shouldDisplayDropdown && Children.count(children) !== 0 && (
        <>
          <div ref={dropdownRef}>{childrenWithProps}</div>
        </>
      )}
    </div>
  );
}
