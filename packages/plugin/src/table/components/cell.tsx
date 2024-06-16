import type { BlockContext, EditorSuite } from "doc-editor-core";
import type { SetNodeOperation } from "doc-editor-delta";
import { HistoryEditor, Transforms } from "doc-editor-delta";
import { EVENT_ENUM, findNodePath, getNodeTupleByDepth } from "doc-editor-utils";
import throttle from "lodash-es/throttle";
import type { FC } from "react";

import { useIndex } from "../hooks/use-index";
import {
  CELL_COL_SPAN,
  MIN_CELL_WIDTH,
  TABLE_BLOCK_KEY,
  TABLE_COL_WIDTHS,
  TABLE_ROW_BLOCK_KEY,
} from "../types";

export const Cell: FC<{
  editor: EditorSuite;
  readonly: boolean;
  context: BlockContext;
}> = props => {
  const { context } = props;
  const { rowIndex, colIndex } = useIndex(context.element);

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    document.body.style.cursor = "col-resize";
    const path = findNodePath(props.editor, context.element);
    const tr = path && getNodeTupleByDepth(props.editor, path, 1);
    const table = path && getNodeTupleByDepth(props.editor, path, 2);
    if (!tr || !tr.node[TABLE_ROW_BLOCK_KEY] || !table || !table.node[TABLE_BLOCK_KEY]) {
      return void 0;
    }
    const originIndex = tr.node.children.findIndex(cell => cell === context.element);
    const span = context.element[CELL_COL_SPAN] || 1;
    // 在单元格横向合并情况下需要重新定位索引
    const index = originIndex + span - 1;
    const colSize = tr.node.children.length;
    if (index < 0 || index + span > colSize) return void 0;
    const colWidths = table.node[TABLE_COL_WIDTHS] || new Array(colSize).fill(MIN_CELL_WIDTH);
    const originWidth = colWidths[originIndex] || MIN_CELL_WIDTH;
    const originX = event.clientX;
    const onMouseMove = throttle((event: MouseEvent) => {
      const diff = event.clientX - originX;
      if (diff === 0) return void 0;
      const newWidth = Math.max(originWidth + diff, MIN_CELL_WIDTH);
      const newColWidths = [...colWidths];
      newColWidths[index] = newWidth;
      HistoryEditor.withoutSaving(props.editor, () => {
        Transforms.setNodes(props.editor, { [TABLE_COL_WIDTHS]: newColWidths }, { at: table.path });
      });
      event.stopPropagation();
    }, 16);
    const onMouseUp = (event: MouseEvent) => {
      const diff = event.clientX - originX;
      const newWidth = Math.max(originWidth + diff, MIN_CELL_WIDTH);
      const newColWidths = [...colWidths];
      newColWidths[index] = newWidth;
      // COMPAT: 缺乏控制`History Merge`的机制 而如果基于`FirstSet`会导致`redo`出现问题
      // 理论上应该需要有控制合并的方法或者基于时间的`Merge`机制 在这里直接主动对栈区写入内容
      // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-history/src/with-history.ts#L62
      const op: SetNodeOperation = {
        type: "set_node",
        path: table.path,
        properties: { [TABLE_COL_WIDTHS]: [...colWidths] },
        newProperties: { [TABLE_COL_WIDTHS]: [...newColWidths] },
      };
      props.editor.history.undos.push([op]);
      document.body.style.cursor = "";
      document.removeEventListener(EVENT_ENUM.MOUSE_MOVE, onMouseMove);
      document.removeEventListener(EVENT_ENUM.MOUSE_UP, onMouseUp);
    };
    document.addEventListener(EVENT_ENUM.MOUSE_MOVE, onMouseMove);
    document.addEventListener(EVENT_ENUM.MOUSE_UP, onMouseUp);
  };

  return (
    <td
      className="table-block-cell"
      data-row={rowIndex}
      data-col={colIndex}
      {...context.props.attributes}
    >
      {/* COMPAT: 必须要从父层传递 否则会无限`ReRender` */}
      {props.children}
      {!props.readonly && (
        <div contentEditable={false} onMouseDown={onMouseDown} className="table-cell-resize"></div>
      )}
    </td>
  );
};
