import type { BlockContext, EditorKit } from "doc-editor-core";
import { Transforms, useSelected } from "doc-editor-delta";
import { EVENT_ENUM } from "doc-editor-utils";
import type { FC } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { useMemoFn } from "../../shared/hooks/preset";
import type { SelectChangeEvent } from "../../shared/types/event";
import { createResizeObserver } from "../../shared/utils/resize";
import { useCompose } from "../hooks/use-compose";
import { TableContext, useTableProvider } from "../hooks/use-context";
import { MIN_CELL_WIDTH, TABLE_COL_WIDTHS } from "../types";
import type { TableSelection, TableViewEvents } from "../types/interface";
import { ColToolBar } from "./col-toolbar";
import { PinToolbar } from "./pin-toolbar";
import { RowToolBar } from "./row-toolbar";

export const Table: FC<{
  editor: EditorKit;
  readonly: boolean;
  context: BlockContext;
  onMount: (events: TableViewEvents) => void;
  onUnMount: (events: TableViewEvents) => void;
}> = props => {
  const { context } = props;
  const isFocusIn = useSelected();
  const wrapper = useRef<HTMLDivElement>(null);
  const { size } = useCompose(context.element);
  const [heights, setHeights] = useState<number[]>([]);
  const [sel, setSel] = useState<TableSelection>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const widths = useMemo(() => {
    const config = context.element[TABLE_COL_WIDTHS];
    if (config) return config;
    // NOTE: 兜底情况 从表格获取节点长度数据
    const len = size.cols;
    return Array(len).fill(MIN_CELL_WIDTH);
  }, [context.element, size.cols]);

  const onSetSelection = (sel: TableSelection) => {
    Transforms.deselect(props.editor.raw);
    setSel(sel);
  };

  const ref: Partial<TableContext["ref"]> = {
    size: size,
    widths: widths,
    heights: heights,
    element: context.element,
    setSelection: onSetSelection,
  };
  const state: TableContext["state"] = {
    selection: sel,
  };
  const { provider } = useTableProvider(ref, state);

  useEffect(() => {
    const el = wrapper.current;
    if (!el || props.readonly) return void 0;
    const onResize = () => {
      // NOTE: 此处该节点的宽度是满宽度即`100%`
      // 在主文档宽度不变的情况下只会触发高度的变更观察
      // COMPAT: 主动保持`trs`和`element.children`一致
      const tbody = el.querySelector("tbody");
      if (!tbody) return void 0;
      const trs = Array.from(tbody.children).filter(node => {
        return node instanceof HTMLTableRowElement;
      });
      const current = provider.ref;
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
    onResize();
    const clear = createResizeObserver(el, onResize);
    return () => {
      clear();
    };
  }, [provider.ref, props.readonly]);

  const onEditorSelectionChange = useMemoFn((e: SelectChangeEvent) => {
    const { previous, current } = e;
    if (!previous && current && sel) {
      setSel(null);
      provider.ref.anchorCell = null;
    }
  });

  useEffect(() => {
    props.onMount({ onEditorSelectionChange });
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseMown = () => setIsMouseDown(true);
    document.addEventListener(EVENT_ENUM.MOUSE_DOWN, onMouseMown);
    document.addEventListener(EVENT_ENUM.MOUSE_UP, onMouseUp);
    return () => {
      props.onUnMount({ onEditorSelectionChange });
      document.removeEventListener(EVENT_ENUM.MOUSE_DOWN, onMouseMown);
      document.removeEventListener(EVENT_ENUM.MOUSE_UP, onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEditorSelectionChange, props.onMount, props.onUnMount]);

  return (
    <div className="table-block-wrapper" ref={wrapper}>
      {/* COMPAT: 工具栏的状态需要主动管理 此时`ref`需要变为`mutable` */}
      {!props.readonly && heights.length > 0 && (
        <RowToolBar
          isFocusIn={isFocusIn || !!sel}
          editor={props.editor}
          provider={{ ...provider.ref }}
          heights={heights}
        ></RowToolBar>
      )}
      {!props.readonly && sel && !isMouseDown && (
        <PinToolbar sel={sel} editor={props.editor} provider={{ ...provider.ref }}></PinToolbar>
      )}
      <div className="table-block-scroll">
        {!props.readonly && (
          <ColToolBar
            isFocusIn={isFocusIn || !!sel}
            editor={props.editor}
            provider={{ ...provider.ref }}
          ></ColToolBar>
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
