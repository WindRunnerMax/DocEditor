import type { BlockContext, EditorSuite } from "doc-editor-core";
import { Transforms } from "doc-editor-delta";
import { findNodePath, getNodeTupleByDepth } from "doc-editor-utils";
import throttle from "lodash-es/throttle";
import type { FC } from "react";

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

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    document.body.style.cursor = "col-resize";
    const path = findNodePath(props.editor, context.element);
    const tr = path && getNodeTupleByDepth(props.editor, path, 1);
    const table = path && getNodeTupleByDepth(props.editor, path, 2);
    if (!tr || !tr.node[TABLE_ROW_BLOCK_KEY] || !table || !table.node[TABLE_BLOCK_KEY]) {
      return void 0;
    }
    const originIndex = tr.node.children.findIndex(cell => cell === context.element);
    const span = context.element[CELL_COL_SPAN] || 1;
    const index = originIndex + span - 1; // 在单元格横向合并情况下需要重新定位索引
    if (index < 0 || index + span > tr.node.children.length) return void 0;
    const colWidths =
      table.node[TABLE_COL_WIDTHS] || new Array(tr.node.children.length).fill(MIN_CELL_WIDTH);
    const originWidth = colWidths[originIndex] || MIN_CELL_WIDTH;
    const originX = event.clientX;
    const onMouseMove = throttle((event: MouseEvent) => {
      const diff = event.clientX - originX;
      if (diff === 0) return void 0;
      const newWidth = Math.max(originWidth + diff, MIN_CELL_WIDTH);
      const newColWidths = [...colWidths];
      newColWidths[index] = newWidth;
      Transforms.setNodes(props.editor, { [TABLE_COL_WIDTHS]: newColWidths }, { at: table.path });
    }, 16);
    const onMouseUp = () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <td className="table-block-cell" {...context.props.attributes}>
      {/* COMPAT: 必须要从父层传递 否则会无限`ReRender` */}
      {props.children}
      <div contentEditable={false} onMouseDown={onMouseDown} className="table-cell-resize"></div>
    </td>
  );
};
