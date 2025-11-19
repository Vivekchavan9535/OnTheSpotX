import { createContext } from "react";

const SearchContext = createContext({
  search: "",
  setSearch: () => {},
});

export default SearchContext;
