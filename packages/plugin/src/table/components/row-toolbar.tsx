import { Button, Trigger } from "@arco-design/web-react";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
import type { EditorKit } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";
import { Editor, Transforms } from "doc-editor-delta";
import { cs, findNodePath } from "doc-editor-utils";
import type { FC } from "react";
import React, { useRef, useState } from "react";

import type { TableContext } from "../hooks/use-context";
import { CELL_COL_SPAN, CELL_ROW_SPAN, TABLE_CELL_BLOCK_KEY, TABLE_ROW_BLOCK_KEY } from "../types";

export const RowToolBar: FC<{
  provider: TableContext["ref"];
  editor: EditorKit;
  heights: number[];
  isFocusIn: boolean;
}> = props => {
  const { editor, heights, provider } = props;
  const { element, size } = provider;
  const [visible, setVisible] = useState<boolean[]>(() => Array(heights.length).fill(false));
  const indexRef = useRef(-1);

  const onInsert = () => {
    if (indexRef.current < 0) return void 0;
    const path = findNodePath(editor.raw, element);
    if (!path) return void 0;
    const rowIndex = indexRef.current;
    const targetRowIndex = indexRef.current + 1;
    const targetPath = path.concat([targetRowIndex]);
    editor.track.batch(() => {
      const rowSpans: number[] = Array.from({ length: size.cols }, (_, colIndex) => {
        // NOTE: 获取到周围两个节点 判断其合并状态
        const topIndex = rowIndex;
        const topPath = path.concat([topIndex, colIndex]);
        const topTuple = topIndex >= 0 && Editor.node(editor.raw, topPath);
        const bottomIndex = rowIndex + 1;
        const bottomPath = path.concat([bottomIndex, colIndex]);
        const bottomTuple = bottomIndex < size.rows && Editor.node(editor.raw, bottomPath);
        if (!topTuple || !bottomTuple || !topTuple[0] || !bottomTuple[0]) return 1;
        const topNode = topTuple[0] as BlockElement;
        const bottomNode = bottomTuple[0] as BlockElement;
        const topColSpan = topNode[CELL_ROW_SPAN] ?? 1;
        const bottomColSpan = bottomNode[CELL_ROW_SPAN] ?? 1;
        // NOTE: 顶部和底部节点存在合并[合并/被合并]的情况
        if (topColSpan !== 1 && bottomColSpan !== 1) {
          for (let i = rowIndex; i >= 0; i--) {
            const cellPath = path.concat([i, colIndex]);
            const tuple = Editor.node(editor.raw, cellPath);
            if (!tuple || !tuple[0]) continue;
            const targetNode = tuple[0] as BlockElement;
            const targetRowSpan = targetNode[CELL_ROW_SPAN] ?? 1;
            if (targetRowSpan <= 1) continue;
            // NOTE: 将单元格合并的单元格数据增加
            Transforms.setNodes(
              editor.raw,
              { [CELL_ROW_SPAN]: targetRowSpan + 1 },
              { at: cellPath }
            );
            break;
          }
          return 0;
        }
        return 1;
      });
      Transforms.insertNodes(
        editor.raw,
        {
          [TABLE_ROW_BLOCK_KEY]: true,
          children: rowSpans.map(rowSpan => ({
            [TABLE_CELL_BLOCK_KEY]: true,
            [CELL_ROW_SPAN]: rowSpan,
            children: [{ children: [{ text: "" }] }],
          })),
        },
        { at: targetPath }
      );
    });
    indexRef.current = -1;
    setVisible(Array(heights.length).fill(false));
  };

  const onDelete = () => {
    if (indexRef.current < 0) return void 0;
    const path = findNodePath(editor.raw, element);
    if (!path) return void 0;
    const targetRowIndex = indexRef.current;
    const targetPath = path.concat([targetRowIndex]);
    editor.track.batch(() => {
      for (let i = 0; i < size.cols; i++) {
        const cellPath = targetPath.concat([i]);
        const tuple = Editor.node(editor.raw, cellPath);
        if (!tuple || !tuple[0]) return void 0;
        const node = tuple[0] as BlockElement;
        const rowSpan = node[CELL_ROW_SPAN] ?? 1;
        if (rowSpan === 1) continue;
        // NOTE: 将要删除的单元格是被合并的状态
        if (rowSpan === 0) {
          for (let k = targetRowIndex - 1; k >= 0; k--) {
            const cellPath = path.concat([k, i]);
            const tuple = Editor.node(editor.raw, cellPath);
            if (!tuple || !tuple[0]) continue;
            const targetNode = tuple[0] as BlockElement;
            const targetRowSpan = targetNode[CELL_ROW_SPAN] ?? 1;
            if (targetRowSpan <= 1) continue;
            // NOTE: 将单元格合并的单元格数据减小
            Transforms.setNodes(
              editor.raw,
              { [CELL_ROW_SPAN]: targetRowSpan - 1 },
              { at: cellPath }
            );
            break;
          }
        }
        // NOTE: 将要删除的单元格合并了其他单元格
        if (rowSpan > 1) {
          const bottomIndex = targetRowIndex + 1;
          if (bottomIndex >= size.rows) continue;
          const targetPath = path.concat([bottomIndex, i]);
          // NOTE: 将数据减小并带到下放单元格 并且需要恢复`COL_SPAN`状态
          Transforms.setNodes(
            editor.raw,
            { [CELL_ROW_SPAN]: rowSpan - 1, [CELL_COL_SPAN]: 1 },
            { at: targetPath }
          );
        }
      }
      Transforms.delete(editor.raw, { at: targetPath });
    });
    indexRef.current = -1;
    setVisible(Array(heights.length).fill(false));
  };

  const ButtonGroup = (
    <div onClick={e => e.stopPropagation()} onMouseDown={e => e.preventDefault()}>
      <Button type="text" onClick={onInsert} icon={<IconPlus />} size="small"></Button>
      <Button
        type="text"
        onClick={onDelete}
        icon={<IconDelete />}
        size="small"
        disabled={heights.length === 1}
      ></Button>
    </div>
  );

  const onClick = (index: number) => {
    indexRef.current = index;
    Transforms.deselect(props.editor.raw);
    props.provider.setSelection(null);
  };

  if (!heights.length) {
    return null;
  }

  return (
    <div
      contentEditable={false}
      className={cs("row-op-toolbar", (props.isFocusIn || visible.some(Boolean)) && "active")}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.preventDefault()}
    >
      {heights.map((height, index) => (
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
            popupAlign={{ left: 3 }}
            trigger="click"
            position="left"
          >
            <div
              className={cs("row-toolbar-block", indexRef.current === index && "active")}
              style={{ height: index ? height : height + 2 }}
              onClick={() => onClick(index)}
            ></div>
          </Trigger>
        </React.Fragment>
      ))}
    </div>
  );
};
