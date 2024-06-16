import type { BlockElement } from "doc-editor-delta";
import { useMemo } from "react";

import { NODE_TO_INDEX, NODE_TO_PARENT } from "../utils/node";

/**
 * 建立`Table`结构关系
 * @param element BlockElement
 */
export const useCompose = (element: BlockElement) => {
  const size = useMemo(() => {
    const table = element;
    const rows = table.children || [];
    const rowSize = table.children.length;
    let colSize = 0;
    rows.forEach((tr, index) => {
      NODE_TO_PARENT.set(tr, table);
      NODE_TO_INDEX.set(tr, index);
      const cells = tr.children || [];
      if (process.env.NODE_ENV === "development") {
        if (index > 0 && colSize !== cells.length) {
          console.error("Table row length is not equal");
        }
      }
      index === 0 && (colSize = cells.length);
      cells.forEach((cell, index) => {
        NODE_TO_PARENT.set(cell, tr as BlockElement);
        NODE_TO_INDEX.set(cell, index);
      });
    });
    return { rows: rowSize, cols: colSize };
  }, [element]);

  return { size };
};
