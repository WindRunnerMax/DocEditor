import type { BlockContext, EditorSuite } from "doc-editor-core";
import type { FC } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { createResizeObserver } from "../../utils/resize";
import { useCompose } from "../hooks/use-compose";
import { TableContext, useTableProvider } from "../hooks/use-context";
import { MIN_CELL_WIDTH, TABLE_COL_WIDTHS } from "../types";
import { ColToolBar } from "./col-toolbar";
import { RowToolBar } from "./row-toolbar";

export const Table: FC<{
  editor: EditorSuite;
  readonly: boolean;
  context: BlockContext;
}> = props => {
  const { context } = props;
  const wrapper = useRef<HTMLDivElement>(null);
  const { size } = useCompose(context.element);
  const [heights, setHeights] = useState<number[]>([]);

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
    heights: heights,
    element: context.element,
  });

  useEffect(() => {
    const el = wrapper.current;
    if (!el || props.readonly) return void 0;
    const handler = () => {
      // NOTE: 此处该节点的宽度是满宽度即`100%`
      // 在主文档宽度不变的情况下只会触发高度的变更观察
      // COMPAT: 主动保持`trs`和`element.children`一致
      const tbody = el.querySelector("tbody");
      if (!tbody) return void 0;
      const trs = Array.from(tbody.children).filter(node => {
        return node instanceof HTMLTableRowElement;
      });
      const current = provider.current;
      current.trs.length = trs.length;
      current.heights.length = trs.length;
      trs.forEach((tr, index) => {
        if (!tr) return void 0;
        const height = tr.getBoundingClientRect().height;
        current.trs[index] = tr as HTMLTableRowElement;
        current.heights[index] = height;
      });
      setHeights([...current.heights]);
    };
    handler();
    const clear = createResizeObserver(el, handler);
    return () => {
      clear();
    };
  }, [provider, props.readonly]);

  return (
    <div className="table-block-wrapper" ref={wrapper}>
      {/* COMPAT: 工具栏的状态需要主动管理 */}
      {!props.readonly && heights.length > 0 && (
        <RowToolBar
          editor={props.editor}
          provider={{ ...provider.current }}
          heights={heights}
        ></RowToolBar>
      )}
      <div className="table-block-scroll">
        {!props.readonly && (
          <ColToolBar editor={props.editor} provider={{ ...provider.current }}></ColToolBar>
        )}
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
