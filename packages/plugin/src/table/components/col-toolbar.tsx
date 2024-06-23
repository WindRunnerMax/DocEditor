import { Button, Trigger } from "@arco-design/web-react";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
import type { EditorKit } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";
import { Editor, Transforms } from "doc-editor-delta";
import { cs, findNodePath } from "doc-editor-utils";
import type { FC } from "react";
import React, { useRef, useState } from "react";

import type { TableContext } from "../hooks/use-context";
import {
  CELL_COL_SPAN,
  CELL_ROW_SPAN,
  MIN_CELL_WIDTH,
  TABLE_CELL_BLOCK_KEY,
  TABLE_COL_WIDTHS,
} from "../types";

export const ColToolBar: FC<{
  isFocusIn: boolean;
  provider: TableContext["ref"];
  editor: EditorKit;
}> = props => {
  const editor = props.editor;
  const { widths, element, size } = props.provider;
  const [visible, setVisible] = useState<boolean[]>(() => Array(widths.length).fill(false));
  const indexRef = useRef(-1);

  const onInsert = () => {
    if (indexRef.current < 0) return void 0;
    const targetCellIndex = indexRef.current + 1;
    const path = findNodePath(editor.raw, element);
    if (!path) return void 0;
    const colWidths = [...widths];
    colWidths.splice(targetCellIndex, 0, MIN_CELL_WIDTH);
    editor.track.batch(() => {
      const doCellMergeState = (rowIndex: number, cellIndex: number): number => {
        // NOTE: 获取到周围两个节点 判断其合并状态
        const leftIndex = cellIndex;
        const leftPath = path.concat([rowIndex, leftIndex]);
        const leftTuple = leftIndex >= 0 && Editor.node(editor.raw, leftPath);
        const rightIndex = cellIndex + 1;
        const rightPath = path.concat([rowIndex, rightIndex]);
        const rightTuple = rightIndex < size.cols && Editor.node(editor.raw, rightPath);
        if (!leftTuple || !rightTuple || !leftTuple[0] || !rightTuple[0]) return 1;
        const leftNode = leftTuple[0] as BlockElement;
        const rightNode = rightTuple[0] as BlockElement;
        const leftColSpan = leftNode[CELL_COL_SPAN] ?? 1;
        const rightColSpan = rightNode[CELL_COL_SPAN] ?? 1;
        // NOTE: 左右节点存在合并[合并/被合并]的情况
        if (leftColSpan !== 1 && rightColSpan !== 1) {
          for (let i = cellIndex; i >= 0; i--) {
            const cellPath = path.concat([rowIndex, i]);
            const tuple = Editor.node(editor.raw, cellPath);
            if (!tuple || !tuple[0]) continue;
            const targetNode = tuple[0] as BlockElement;
            const targetColSpan = targetNode[CELL_COL_SPAN] ?? 1;
            if (targetColSpan <= 1) continue;
            // NOTE: 将单元格合并的单元格数据增加
            Transforms.setNodes(
              editor.raw,
              { [CELL_COL_SPAN]: targetColSpan + 1 },
              { at: cellPath }
            );
            break;
          }
          return 0;
        }
        return 1;
      };
      element.children.forEach((_, index) => {
        const cellPath = path.concat([index, targetCellIndex]);
        const colSpan = doCellMergeState(index, targetCellIndex - 1);
        Transforms.insertNodes(
          editor.raw,
          {
            [TABLE_CELL_BLOCK_KEY]: true,
            [CELL_COL_SPAN]: colSpan,
            children: [{ children: [{ text: "" }] }],
          },
          { at: cellPath }
        );
      });
      Transforms.setNodes(props.editor.raw, { [TABLE_COL_WIDTHS]: colWidths }, { at: path });
    });
    indexRef.current = -1;
    setVisible(Array(widths.length).fill(false));
  };

  const onDelete = () => {
    if (indexRef.current < 0) return void 0;
    const cellIndex = indexRef.current;
    const path = findNodePath(editor.raw, element);
    if (!path) return void 0;
    const colWidths = [...widths];
    colWidths.splice(cellIndex, 1);
    editor.track.batch(() => {
      const doCellMergeState = (rowIndex: number, cellIndex: number, cellPath: number[]) => {
        // NOTE: 先获取到节点 判断其合并状态
        const tuple = Editor.node(editor.raw, cellPath);
        if (!tuple || !tuple[0]) return void 0;
        const node = tuple[0] as BlockElement;
        const colSpan = node[CELL_COL_SPAN] ?? 1;
        if (colSpan === 1) return void 0;
        // NOTE: 将要删除的单元格是被合并的状态
        if (colSpan === 0) {
          for (let i = cellIndex - 1; i >= 0; i--) {
            const cellPath = path.concat([rowIndex, i]);
            const tuple = Editor.node(editor.raw, cellPath);
            if (!tuple || !tuple[0]) continue;
            const targetNode = tuple[0] as BlockElement;
            const targetColSpan = targetNode[CELL_COL_SPAN] ?? 1;
            if (targetColSpan <= 1) continue;
            // NOTE: 将单元格合并的单元格数据减小
            Transforms.setNodes(
              editor.raw,
              { [CELL_COL_SPAN]: targetColSpan - 1 },
              { at: cellPath }
            );
            break;
          }
        }
        // NOTE: 将要删除的单元格合并了其他单元格
        if (colSpan > 1) {
          const rightIndex = cellIndex + 1;
          if (rightIndex >= size.cols) return void 0;
          const targetPath = path.concat([rowIndex, rightIndex]);
          // NOTE: 将数据减小并带到右侧单元格 并且需要恢复`ROW_SPAN`状态
          Transforms.setNodes(
            editor.raw,
            { [CELL_COL_SPAN]: colSpan - 1, [CELL_ROW_SPAN]: 1 },
            { at: targetPath }
          );
        }
      };
      element.children.forEach((_, rowIndex) => {
        const cellPath = path.concat([rowIndex, cellIndex]);
        doCellMergeState(rowIndex, cellIndex, cellPath);
        // NOTE: 删除单元格
        Transforms.delete(editor.raw, { at: cellPath });
      });
      Transforms.setNodes(props.editor.raw, { [TABLE_COL_WIDTHS]: colWidths }, { at: path });
    });
    indexRef.current = -1;
    setVisible(Array(widths.length).fill(false));
  };

  const ButtonGroup = (
    <div onClick={e => e.stopPropagation()} onMouseDown={e => e.preventDefault()}>
      <Button type="text" onClick={onInsert} icon={<IconPlus />} size="small"></Button>
      <Button
        type="text"
        onClick={onDelete}
        icon={<IconDelete />}
        size="small"
        disabled={widths.length === 1}
      ></Button>
    </div>
  );

  const onClick = (index: number) => {
    indexRef.current = index;
    Transforms.deselect(props.editor.raw);
    props.provider.setSelection(null);
  };

  return (
    <div
      contentEditable={false}
      className={cs("col-op-toolbar", (props.isFocusIn || visible.some(Boolean)) && "active")}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.preventDefault()}
    >
      {widths.map((width, index) => (
        <React.Fragment key={index}>
          <Trigger
            popupVisible={visible[index]}
            onVisibleChange={visible => {
              setVisible(prev => {
                if (!visible) {
                  indexRef.current = -1;
                }
                const next = [...prev];
                next[index] = visible;
                return next;
              });
            }}
            className="table-toolbar-trigger"
            popup={() => ButtonGroup}
            popupAlign={{ top: 3 }}
            trigger="click"
            position="top"
          >
            <div
              className={cs("col-toolbar-block", indexRef.current === index && "active")}
              style={{ width: index ? width : width + 1 }}
              onClick={() => onClick(index)}
            ></div>
          </Trigger>
        </React.Fragment>
      ))}
    </div>
  );
};
