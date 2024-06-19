import { Button, Trigger } from "@arco-design/web-react";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
import type { EditorSuite } from "doc-editor-core";
import { Range, Transforms } from "doc-editor-delta";
import { cs, findNodePath } from "doc-editor-utils";
import type { FC } from "react";
import React, { useRef, useState } from "react";

import type { TableContext } from "../hooks/use-context";
import { MIN_CELL_WIDTH, TABLE_CELL_BLOCK_KEY, TABLE_COL_WIDTHS } from "../types";

export const ColToolBar: FC<{ provider: TableContext; editor: EditorSuite }> = props => {
  const editor = props.editor;
  const { widths, element } = props.provider;
  const [visible, setVisible] = useState<boolean[]>(() => Array(widths.length).fill(false));
  const indexRef = useRef(-1);

  const onInsert = () => {
    if (indexRef.current < 0) return void 0;
    const targetCellIndex = indexRef.current + 1;
    const path = findNodePath(editor, element);
    if (!path) return void 0;
    const colWidths = [...widths];
    colWidths.splice(targetCellIndex, 0, MIN_CELL_WIDTH);
    editor.track.batch(() => {
      element.children.forEach((_, index) => {
        const cellPath = path.concat([index, targetCellIndex]);
        Transforms.insertNodes(
          editor,
          {
            [TABLE_CELL_BLOCK_KEY]: true,
            children: [{ children: [{ text: "" }] }],
          },
          { at: cellPath }
        );
      });
      Transforms.setNodes(props.editor, { [TABLE_COL_WIDTHS]: colWidths }, { at: path });
    });
    indexRef.current = -1;
    setVisible(Array(widths.length).fill(false));
  };

  const onDelete = () => {
    if (indexRef.current < 0) return void 0;
    const cellIndex = indexRef.current;
    const path = findNodePath(editor, element);
    if (!path) return void 0;
    const colWidths = [...widths];
    colWidths.splice(cellIndex, 1);
    editor.track.batch(() => {
      element.children.forEach((_, index) => {
        const cellPath = path.concat([index, cellIndex]);
        Transforms.delete(editor, { at: cellPath });
        Transforms.setNodes(props.editor, { [TABLE_COL_WIDTHS]: colWidths }, { at: path });
      });
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
    const selection = props.editor.selection;
    if (selection && !Range.isCollapsed(selection)) {
      Transforms.deselect(props.editor);
    }
  };

  return (
    <div
      contentEditable={false}
      className={cs("col-op-toolbar", visible.some(Boolean) && "active")}
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
