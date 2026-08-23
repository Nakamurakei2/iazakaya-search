"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type InputSearchCondition = {
  mode: "0";
  keyword: string;
};

type LocationSearchCondition = {
  mode: "1";
  keyword: {
    lat: number;
    lng: number;
  };
};

type SearchCondition = InputSearchCondition | LocationSearchCondition;

type SearchContextValue = {
  searchCondition: SearchCondition | undefined;
  setSearchCondition: Dispatch<SetStateAction<SearchCondition | undefined>>;
  pageStart: number;
  setPageStart: Dispatch<SetStateAction<number>>;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchCondition, setSearchCondition] = useState<SearchCondition>();
  const [pageStart, setPageStart] = useState(1);
  const [count, setCount] = useState(10);

  return (
    <SearchContext.Provider
      value={{
        searchCondition,
        setSearchCondition,
        pageStart,
        setPageStart,
        count,
        setCount,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within SearchProvider");
  }

  return context;
};
