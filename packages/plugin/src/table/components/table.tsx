import type { BlockContext } from "doc-editor-core";
import type { FC } from "react";
import React, { useMemo } from "react";

import { useCompose } from "../hooks/use-compose";
import { TableContext, useTableProvider } from "../hooks/use-context";
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

  const { provider } = useTableProvider({
    size: size,
    widths: widths,
    element: context.element,
  });

  return (
    <div className="table-block-wrapper">
      {/* <div contentEditable={false} className="col-op-toolbar"></div>
      <div contentEditable={false} className="row-op-toolbar"></div> */}
      <div className="table-block-scroll">
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
    </div>
  );
};
