import "./index.scss";

import { Menu } from "@arco-design/web-react";
import { useMemoizedFn } from "ahooks";
import type { EditorKit } from "doc-editor-core";
import type { TextElement } from "doc-editor-delta";
import { Editor } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";
import { EVENT_ENUM } from "doc-editor-utils";
import { omit } from "doc-editor-utils";
import type { FC } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { FONT_BASE_KEY } from "../font-base/types";
import { HYPER_LINK_KEY } from "../hyper-link/types";
import { LINE_HEIGHT_KEY } from "../line-height/types";
import { MenuItems } from "./components/menu";
import { execSelectMarks, getSelectionRect, maskMenuToolBar, Portal } from "./utils/selection";

const TOOLBAR_OFFSET_HEIGHT = 40;
const TOOLBAR_OFFSET_WIDTH = 340;

const NOT_INIT_SELECT = [HYPER_LINK_KEY, FONT_BASE_KEY];
const MUTEX_SELECT = [...NOT_INIT_SELECT, LINE_HEIGHT_KEY];

export const MenuToolBar: FC<{
  readonly: boolean;
  editor: EditorKit;
}> = props => {
  const editor = props.editor;
  const keepStatus = useRef(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [selectedMarks, setSelectedMarks] = useState<string[]>([]);

  const wakeUpToolbar = useMemoizedFn((wakeUp: boolean) => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return void 0;
    if (ReactEditor.isFocused(editor.raw) && wakeUp) {
      setSelectedMarks(omit(Object.keys(Editor.marks(editor.raw) || []), NOT_INIT_SELECT));
      const rect = getSelectionRect();
      if (rect) {
        toolbar.style.top = `${rect.top + window.pageYOffset - TOOLBAR_OFFSET_HEIGHT - 10}px`;
        toolbar.style.left = `${
          rect.left + window.pageXOffset - TOOLBAR_OFFSET_WIDTH / 2 + rect.width / 2
        }px`;
      }
    } else {
      maskMenuToolBar(toolbar);
    }
  });

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar || props.readonly) return void 0;
    const mouseUpHandler = () => {
      !keepStatus.current && (toolbar.style.display = "");
    };
    const mouseDownHandler = () => {
      !keepStatus.current && (toolbar.style.display = "none");
    };
    const selectionChangeHandler = () => {
      if (keepStatus.current) return void 0;
      const sel = window.getSelection();
      const isWakeUp = sel ? !sel.isCollapsed : false;
      wakeUpToolbar(isWakeUp);
    };
    document.addEventListener(EVENT_ENUM.MOUSE_UP, mouseUpHandler);
    document.addEventListener(EVENT_ENUM.MOUSE_DOWN, mouseDownHandler);
    document.addEventListener(EVENT_ENUM.SELECTION_CHANGE, selectionChangeHandler);
    return () => {
      document.removeEventListener(EVENT_ENUM.MOUSE_UP, mouseUpHandler);
      document.removeEventListener(EVENT_ENUM.MOUSE_DOWN, mouseDownHandler);
      document.addEventListener(EVENT_ENUM.SELECTION_CHANGE, selectionChangeHandler);
    };
  }, [editor, wakeUpToolbar, props.readonly]);

  const exec = useMemoizedFn(
    (param: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const [key, extraKey] = param.split(".");
      const marks = Editor.marks(editor.raw);
      const position = { left: 0, top: 0 };
      const toolbar = toolbarRef.current;
      setSelectedMarks(execSelectMarks(key, selectedMarks, MUTEX_SELECT));
      if (toolbar) {
        position.top = toolbar.offsetTop + toolbar.offsetHeight / 2;
        position.left = toolbar.offsetLeft + toolbar.offsetWidth / 2;
      }
      const result = props.editor.command.exec(key, {
        extraKey,
        event,
        position,
        marks: marks as TextElement,
      });
      if (result) {
        keepStatus.current = true;
        result.then(() => (keepStatus.current = false));
      }
    }
  );

  const HoverMenu = useMemo(
    () => (
      <Menu
        className="menu-toolbar-container"
        onClickMenuItem={exec}
        onMouseUp={e => e.stopPropagation()}
        onMouseDown={e => {
          // Prevent toolbar from taking focus away from editor
          e.preventDefault();
          e.stopPropagation();
        }}
        mode="vertical"
        selectedKeys={selectedMarks}
      >
        {MenuItems}
      </Menu>
    ),
    [exec, selectedMarks]
  );

  return props.readonly ? null : (
    <Portal>
      <div ref={toolbarRef} className="hover-menu-container">
        {HoverMenu}
      </div>
    </Portal>
  );
};
