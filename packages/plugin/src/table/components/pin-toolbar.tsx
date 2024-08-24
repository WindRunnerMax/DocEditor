import { Button } from "@arco-design/web-react";
import type { EditorKit } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";
import { Editor, Transforms } from "doc-editor-delta";
import { findNodePath } from "doc-editor-utils";
import type { FC } from "react";
import { useMemo } from "react";

import { Trigger } from "../../shared/modules/trigger";
import type { TableContext } from "../hooks/use-context";
import { MergeIcon } from "../icon/merge";
import { SplitIcon } from "../icon/split";
import { CELL_COL_SPAN, CELL_ROW_SPAN } from "../types";
import type { TableSelection } from "../types/interface";

export const PinToolbar: FC<{
  sel: Exclude<TableSelection, null>;
  provider: TableContext["ref"];
  editor: EditorKit;
}> = props => {
  const { editor, provider, sel } = props;
  const { element, widths } = provider;

  const [startRow, startCol] = sel.start;
  const [endRow, endCol] = sel.end;

  const { isMergeAble, isSplitAble } = useMemo(() => {
    const path = findNodePath(editor.raw, element);
    if (!path) {
      return { isMergeAble: false, isSplitAble: false };
    }
    const firstNodePath = path.concat(startRow, startCol);
    const tuple = Editor.node(editor.raw, firstNodePath);
    if (!tuple || !tuple[0]) {
      return { isMergeAble: false, isSplitAble: false };
    }
    const node = tuple[0] as BlockElement;
    const rowSpan = node[CELL_ROW_SPAN] ?? 1;
    const colSpan = node[CELL_COL_SPAN] ?? 1;
    const isRowAll = startRow + rowSpan - 1 === endRow;
    const isColAll = startCol + colSpan - 1 === endCol;
    // NOTE: 表示并没有选择全部的内容 即并非选中的`DOM`仅一个单元格
    if (!isRowAll || !isColAll) {
      return { isMergeAble: true, isSplitAble: false };
    }
    // NOTE: 表示仅选中了一个单元格 且该单元格是合并单元格
    if (rowSpan !== 1 || colSpan !== 1) {
      return { isMergeAble: false, isSplitAble: true };
    }
    return { isMergeAble: false, isSplitAble: false };
  }, [editor, element, endCol, endRow, startCol, startRow]);

  const onMerge = () => {
    const path = findNodePath(editor.raw, element);
    if (!path) return void 0;
    editor.track.batch(() => {
      const rowSpan = endRow - startRow + 1;
      const colSpan = endCol - startCol + 1;
      for (let i = startRow; i <= endRow; i++) {
        for (let k = startCol; k <= endCol; k++) {
          if (i === startRow && k === startCol) {
            const target = path.concat(i, k);
            Transforms.setNodes(
              editor.raw,
              { [CELL_ROW_SPAN]: rowSpan, [CELL_COL_SPAN]: colSpan },
              { at: target }
            );
            continue;
          }
          const target = path.concat(i, k);
          Transforms.setNodes(
            editor.raw,
            { [CELL_ROW_SPAN]: 0, [CELL_COL_SPAN]: 0 },
            { at: target }
          );
        }
      }
    });
    provider.setSelection(null);
  };

  const onSplit = () => {
    const path = findNodePath(editor.raw, element);
    if (!path) return void 0;
    editor.track.batch(() => {
      for (let i = startRow; i <= endRow; i++) {
        for (let k = startCol; k <= endCol; k++) {
          const target = path.concat(i, k);
          Transforms.setNodes(
            editor.raw,
            { [CELL_ROW_SPAN]: 1, [CELL_COL_SPAN]: 1 },
            { at: target }
          );
        }
      }
    });
    provider.setSelection(null);
  };

  const Popup = (
    <div
      onClick={e => e.stopPropagation()}
      onMouseDown={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Button
        type="text"
        onClick={onMerge}
        icon={MergeIcon}
        size="small"
        disabled={!isMergeAble}
      ></Button>
      <Button
        type="text"
        onClick={onSplit}
        icon={SplitIcon}
        size="small"
        disabled={!isSplitAble}
      ></Button>
    </div>
  );

  const { left, width } = useMemo(() => {
    const startCol = sel.start[1];
    const endCol = sel.end[1];
    const left = widths.slice(0, startCol).reduce((acc, cur) => acc + cur, 0);
    const width = widths.slice(startCol, endCol + 1).reduce((acc, cur) => acc + cur, 0);
    return { left, width };
  }, [sel.end, sel.start, widths]);

  return (
    <Trigger
      className="table-toolbar-trigger"
      popupVisible={true}
      popup={() => Popup}
      position="top"
      popupAlign={{ top: -2 }}
    >
      <div
        contentEditable={false}
        className="merge-toolbar-container"
        style={{ width, left }}
      ></div>
    </Trigger>
  );
};
