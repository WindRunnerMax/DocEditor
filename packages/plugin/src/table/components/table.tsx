import type { BlockContext } from "doc-editor-core";
import type { FC } from "react";
import React, { useMemo } from "react";

import { MIN_CELL_WIDTH, TABLE_COL_WIDTHS } from "../types";

export const Table: FC<{
  context: BlockContext;
}> = props => {
  const { context } = props;

  const widths = useMemo(() => {
    const config = context.element[TABLE_COL_WIDTHS];
    if (config) return config;
    // 兜底情况 从表格首行获取节点长度数据
    const len = context.element.children?.[0].children?.length || 0;
    return Array(len).fill(MIN_CELL_WIDTH);
  }, [context.element]);

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
        <tbody>{props.children}</tbody>
      </table>
    </div>
  );
};
