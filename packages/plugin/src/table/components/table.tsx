import type { BlockContext } from "doc-editor-core";
import type { FC } from "react";
import React, { useEffect, useMemo, useRef } from "react";

import type { ResizeCallback } from "../../utils/resize";
import { createResizeObserver } from "../../utils/resize";
import { useCompose } from "../hooks/use-compose";
import { TableContext, useTableProvider } from "../hooks/use-context";
import { MIN_CELL_WIDTH, TABLE_COL_WIDTHS } from "../types";

export const Table: FC<{
  context: BlockContext;
}> = props => {
  const { context } = props;
  const wrapper = useRef<HTMLDivElement>(null);
  const { size } = useCompose(context.element);

  const widths = useMemo(() => {
    const config = context.element[TABLE_COL_WIDTHS];
    if (config) return config;
    // NOTE: 兜底情况 从表格获取节点长度数据
    const len = size.cols;
    return Array(len).fill(MIN_CELL_WIDTH);
  }, [context.element, size.cols]);

  const { provider } = useTableProvider({
    size: size,
    widths: widths,
    element: context.element,
  });

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return void 0;
    const handler: ResizeCallback = (prev, next) => {
      // NOTE: 此处该节点的宽度是满宽度即`100%`
      // 在主文档宽度不变的情况下只会触发高度的变更观察
      console.log("resize", prev, next);
    };
    const clear = createResizeObserver(el, handler);
    return () => {
      clear();
    };
  }, []);

  return (
    <div className="table-block-wrapper" ref={wrapper}>
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
