import type { BlockElement } from "doc-editor-delta";
import React from "react";

export type TableContext = {
  widths: number[];
  element: BlockElement;
  trs: HTMLTableRowElement[];
  size: { rows: number; cols: number };
};

export const DEFAULT_TABLE_CONTEXT: TableContext = {
  trs: [],
  widths: [],
  element: { children: [] },
  size: { rows: -1, cols: -1 },
};

export const TableContext = React.createContext<React.RefObject<TableContext>>({
  current: DEFAULT_TABLE_CONTEXT,
});

export const useTableProvider = (values: Partial<TableContext>) => {
  // COMPAT: 由`ref`保持`immutable`
  // 渲染行为由插件调度 避免`provider`导致的`re-render`
  const provider = React.useRef<TableContext>(DEFAULT_TABLE_CONTEXT);
  Object.assign(provider.current, values);
  return { provider };
};

export const useTableContext = () => {
  const consumer = React.useContext(TableContext);
  return { provider: consumer.current! };
};
