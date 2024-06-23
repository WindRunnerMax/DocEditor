import type { BlockElement } from "doc-editor-delta";
import React, { useMemo } from "react";

import type { TableSelection } from "../types/interface";

export type TableContext = {
  readonly ref: {
    widths: number[];
    heights: number[];
    element: BlockElement;
    trs: HTMLTableRowElement[];
    size: { rows: number; cols: number };
    /**
     * NOTE: RowIndex ColIndex RowSpan ColSpan
     */
    anchorCell: [number, number, number, number] | null;
    setSelection: (sel: TableSelection | null) => void;
  };
  state: {
    selection: TableSelection | null;
  };
};

export const DEFAULT_TABLE_CONTEXT: TableContext = {
  ref: {
    trs: [],
    widths: [],
    heights: [],
    element: { children: [] },
    size: { rows: -1, cols: -1 },
    anchorCell: null,
    setSelection: () => null,
  },
  state: {
    selection: null,
  },
};

export const TableContext = React.createContext<TableContext>(DEFAULT_TABLE_CONTEXT);

export const useTableProvider = (
  ref: Partial<TableContext["ref"]>,
  state: TableContext["state"]
) => {
  // COMPAT: 由`ref`保持`immutable`
  // 此时渲染行为由插件调度 避免`provider`导致的`re-render`
  // FIX: `DEFAULT_TABLE_CONTEXT`必须要`immutable` 否则会导致多个表格的数据共享
  const current = useMemo(() => ({ ...DEFAULT_TABLE_CONTEXT.ref }), []);
  Object.assign(current, ref);
  // COMPAT:  由`state`保持`mutable`
  // 此时需要依靠副作用严格控制`re-render`
  const provider: TableContext = useMemo(() => ({ ref: current, state }), [state.selection]);
  return { provider };
};

export const useTableContext = () => {
  const consumer = React.useContext(TableContext);
  return { ref: consumer.ref, state: consumer.state };
};
