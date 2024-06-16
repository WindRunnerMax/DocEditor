import type { BlockElement } from "doc-editor-delta";
import { isNil } from "doc-editor-utils";

import { TABLE_CELL_BLOCK_KEY } from "../types";
import { NODE_TO_INDEX, NODE_TO_PARENT } from "../utils/node";

type Result = { rowIndex: number | null; colIndex: number | null };

export const useIndex = (element: BlockElement | null) => {
  const res: Result = { rowIndex: null, colIndex: null };
  if (!element || !element[TABLE_CELL_BLOCK_KEY]) return res;
  const parent = NODE_TO_PARENT.get(element);
  const row = parent && NODE_TO_INDEX.get(parent);
  const col = NODE_TO_INDEX.get(element);
  res.rowIndex = isNil(row) ? null : row;
  res.colIndex = isNil(col) ? null : col;
  return res;
};
