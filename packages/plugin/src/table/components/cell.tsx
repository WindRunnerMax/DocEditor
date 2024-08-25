import type { BlockContext, EditorKit } from "doc-editor-core";
import { EDITOR_STATE } from "doc-editor-core";
import type { SetNodeOperation } from "doc-editor-delta";
import { HistoryEditor, Transforms } from "doc-editor-delta";
import { cs, EVENT_ENUM, findNodePath, getNodeTupleByDepth, isNil } from "doc-editor-utils";
import { throttle } from "doc-editor-utils";
import type { FC } from "react";
import { useMemo } from "react";

import { useTableContext } from "../hooks/use-context";
import { useIndex } from "../hooks/use-index";
import {
  CELL_COL_SPAN,
  CELL_ROW_SPAN,
  MIN_CELL_WIDTH,
  TABLE_BLOCK_KEY,
  TABLE_COL_WIDTHS,
  TABLE_ROW_BLOCK_KEY,
} from "../types";

export const Cell: FC<{
  editor: EditorKit;
  readonly: boolean;
  context: BlockContext;
}> = props => {
  const { context } = props;
  const { ref, state } = useTableContext();
  const { rowIndex, colIndex } = useIndex(context.element);
  const colSpan = context.element[CELL_COL_SPAN] ?? 1;
  const rowSpan = context.element[CELL_ROW_SPAN] ?? 1;

  const onResizeMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    document.body.style.cursor = "col-resize";
    const path = findNodePath(props.editor.raw, context.element);
    const tr = path && getNodeTupleByDepth(props.editor.raw, path, 1);
    const table = path && getNodeTupleByDepth(props.editor.raw, path, 2);
    if (
      !tr ||
      !tr.node[TABLE_ROW_BLOCK_KEY] ||
      !table ||
      !table.node[TABLE_BLOCK_KEY] ||
      isNil(colIndex)
    ) {
      return void 0;
    }
    const originIndex = colIndex;
    // NOTE: 在单元格横向合并情况下需要重新定位索引
    const index = originIndex + colSpan - 1;
    const colSize = ref.size.cols;
    if (index < 0 || index > colSize) return void 0;
    const colWidths = ref.widths;
    const originWidth = colWidths[originIndex] || MIN_CELL_WIDTH;
    const originX = event.clientX;
    const onMouseMove = throttle((event: MouseEvent) => {
      const diff = event.clientX - originX;
      if (diff === 0) return void 0;
      const newWidth = Math.max(originWidth + diff, MIN_CELL_WIDTH);
      const newColWidths = [...colWidths];
      newColWidths[index] = newWidth;
      HistoryEditor.withoutSaving(props.editor.raw, () => {
        Transforms.setNodes(
          props.editor.raw,
          { [TABLE_COL_WIDTHS]: newColWidths },
          { at: table.path }
        );
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
      props.editor.raw.history.undos.push([op]);
      document.body.style.cursor = "";
      document.removeEventListener(EVENT_ENUM.MOUSE_MOVE, onMouseMove);
      document.removeEventListener(EVENT_ENUM.MOUSE_UP, onMouseUp);
    };
    document.addEventListener(EVENT_ENUM.MOUSE_MOVE, onMouseMove);
    document.addEventListener(EVENT_ENUM.MOUSE_UP, onMouseUp);
  };

  const onCellMouseEnter = (e: React.MouseEvent<HTMLTableCellElement>) => {
    const isMouseDown = props.editor.state.get(EDITOR_STATE.IS_MOUSE_DOWN);
    if (
      !isMouseDown ||
      props.readonly ||
      !ref.anchorCell ||
      isNil(colIndex) ||
      isNil(rowIndex) ||
      !rowSpan ||
      !colSpan
    ) {
      return void 0;
    }
    const [anchorRow, anchorCol, anchorRowSpan, anchorColSpan] = ref.anchorCell;
    const maxFocusRowIndex = rowIndex + rowSpan - 1;
    const maxFocusColIndex = colIndex + colSpan - 1;
    const maxAnchorRowIndex = anchorRow + anchorRowSpan - 1;
    const maxAnchorColIndex = anchorCol + anchorColSpan - 1;
    const minRow = Math.min(anchorRow, rowIndex, maxFocusRowIndex, maxAnchorRowIndex);
    const minCol = Math.min(anchorCol, colIndex, maxFocusColIndex, maxAnchorColIndex);
    const maxRow = Math.max(anchorRow, rowIndex, maxFocusRowIndex, maxAnchorRowIndex);
    const maxCol = Math.max(anchorCol, colIndex, maxFocusColIndex, maxAnchorColIndex);
    ref.setSelection({ start: [minRow, minCol], end: [maxRow, maxCol] });
    e.preventDefault();
    e.stopPropagation();
  };

  const onCellMouseDown = () => {
    if (isNil(colIndex) || isNil(rowIndex) || props.readonly) return void 0;
    ref.anchorCell = [rowIndex, colIndex, rowSpan, colSpan];
  };

  const isInSelectionRange = useMemo(() => {
    const selection = state.selection;
    if (!selection || isNil(rowIndex) || isNil(colIndex)) return false;
    const { start, end } = selection;
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    if (rowIndex >= startRow && rowIndex <= endRow && colIndex >= startCol && colIndex <= endCol) {
      return true;
    }
    return false;
  }, [colIndex, rowIndex, state.selection]);

  return colSpan !== 0 && rowSpan !== 0 ? (
    <td
      className={cs("table-block-cell", isInSelectionRange && "is-selected")}
      {...context.props.attributes}
      onMouseEnter={onCellMouseEnter}
      onMouseDown={onCellMouseDown}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {/* COMPAT: 必须要从父层传递 否则会无限`ReRender` */}
      {props.children}
      {!props.readonly && (
        <div
          contentEditable={false}
          onMouseDown={onResizeMouseDown}
          className="table-cell-resize"
        ></div>
      )}
    </td>
  ) : null;
};
