import React from "react";

type TableContext = {
  size: { rows: number; cols: number };
};

export const TableContext = React.createContext<TableContext>({
  size: { rows: 0, cols: 0 },
});

export const useTableContext = () => {
  return React.useContext(TableContext);
};
