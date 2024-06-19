import { Button, Trigger } from "@arco-design/web-react";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
import type { EditorSuite } from "doc-editor-core";
import { Range, Transforms } from "doc-editor-delta";
import { cs, findNodePath } from "doc-editor-utils";
import type { FC } from "react";
import React, { useRef, useState } from "react";

import type { TableContext } from "../hooks/use-context";
import { TABLE_CELL_BLOCK_KEY, TABLE_ROW_BLOCK_KEY } from "../types";

export const RowToolBar: FC<{ provider: TableContext; editor: EditorSuite; heights: number[] }> =
  props => {
    const { editor, heights, provider } = props;
    const { element, size } = provider;
    const [visible, setVisible] = useState<boolean[]>(() => Array(heights.length).fill(false));
    const indexRef = useRef(-1);

    const onInsert = () => {
      if (indexRef.current < 0) return void 0;
      const path = findNodePath(editor, element);
      if (!path) return void 0;
      const targetRowIndex = indexRef.current + 1;
      const targetPath = path.concat([targetRowIndex]);
      editor.track.batch(() => {
        Transforms.insertNodes(
          editor,
          {
            [TABLE_ROW_BLOCK_KEY]: true,
            children: Array.from({ length: size.cols }, () => ({
              [TABLE_CELL_BLOCK_KEY]: true,
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
      const path = findNodePath(editor, element);
      if (!path) return void 0;
      const targetRowIndex = indexRef.current;
      const targetPath = path.concat([targetRowIndex]);
      editor.track.batch(() => {
        Transforms.delete(editor, { at: targetPath });
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
      const selection = props.editor.selection;
      if (selection && !Range.isCollapsed(selection)) {
        Transforms.deselect(props.editor);
      }
    };

    if (!heights.length) {
      return null;
    }

    return (
      <div
        contentEditable={false}
        className={cs("row-op-toolbar", visible.some(Boolean) && "active")}
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
