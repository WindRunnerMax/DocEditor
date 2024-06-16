import type { BlockContext } from "doc-editor-core";
import type { FC } from "react";
import React, { useMemo } from "react";

import { useCompose } from "../hooks/use-compose";
import { TableContext } from "../hooks/use-context";
import { MIN_CELL_WIDTH, TABLE_COL_WIDTHS } from "../types";

export const Table: FC<{
  context: BlockContext;
}> = props => {
  const { context } = props;
  const { size } = useCompose(context.element);

  const widths = useMemo(() => {
    const config = context.element[TABLE_COL_WIDTHS];
    if (config) return config;
    // 兜底情况 从表格获取节点长度数据
    const len = size.cols;
    return Array(len).fill(MIN_CELL_WIDTH);
  }, [context.element, size.cols]);

  const provider = useMemo(() => {
    // 保持`immutable` 尽可能避免`provider`导致的`re-render`
    return {
      size: { ...size },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.cols, size.rows]);

  return (
    <div className="table-block-wrapper">
      <table className="table-block">
        <colgroup contentEditable={false}>
          {widths.map((width, index) => (
            <React.Fragment key={index}>
              <col style={{ width }}></col>
            </React.Fragment>
          ))}
          {widths.length > 0 && <col style={{ width: "100%" }}></col>}
        </colgroup>
        <TableContext.Provider value={provider}>
          <tbody>{props.children}</tbody>
        </TableContext.Provider>
      </table>
    </div>
  );
};
