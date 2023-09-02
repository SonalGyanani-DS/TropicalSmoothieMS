import React, { createContext, useState } from "react";

interface ContextType {
  hoverLocation: string;
  clickLocation: string;
  setHoverLocation: (value: string) => void;
  setClickLocation: (value: string) => void;
}

interface SearchProviderProps {
  children: React.ReactNode;
}

const defaultContextValue: ContextType = {
  hoverLocation: "",
  clickLocation: "",
  setHoverLocation: () => {console.log("setHoverLocation");},
  setClickLocation: () => {console.log("setClickLocation");},
};

const SearchContext = createContext<ContextType>(defaultContextValue);

const SearchContextProvider = ({ children }: SearchProviderProps) => {
  const [hoverLocation, setHoverLocation] = useState("");
  const [clickLocation, setClickLocation] = useState("");

  const value = { hoverLocation, clickLocation, setHoverLocation, setClickLocation };
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchContextProvider };
