import "./styles/index.scss";

import { Menu } from "@arco-design/web-react";
import type { EditorKit } from "doc-editor-core";
import type { TextElement } from "doc-editor-delta";
import { Editor } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";
import { EVENT_ENUM, preventEvent } from "doc-editor-utils";
import { Collection } from "doc-editor-utils";
import type { FC } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { FONT_BASE_KEY } from "../font-base/types";
import { HYPER_LINK_KEY } from "../hyper-link/types";
import { LINE_HEIGHT_KEY } from "../line-height/types";
import { useMemoFn } from "../shared/hooks/preset";
import { MenuItems } from "./components/menu";
import { execSelectMarks, getSelectionRect, Portal } from "./utils/selection";

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
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [visible, setVisible] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectedMarks, setSelectedMarks] = useState<string[]>([]);

  const wakeUpToolbar = useMemoFn((wakeUp: boolean) => {
    if (ReactEditor.isFocused(editor.raw) && wakeUp) {
      setSelectedMarks(
        Collection.omit(Object.keys(Editor.marks(editor.raw) || []), NOT_INIT_SELECT)
      );
      const rect = getSelectionRect();
      if (rect) {
        const t = rect.top + window.scrollY - TOOLBAR_OFFSET_HEIGHT - 10;
        const l = rect.left + window.scrollX - TOOLBAR_OFFSET_WIDTH / 2 + rect.width / 2;
        setTop(t);
        setLeft(l);
      }
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  useEffect(() => {
    if (props.readonly) return void 0;
    const mouseUpHandler = () => {
      !keepStatus.current && setIsMouseDown(false);
    };
    const mouseDownHandler = () => {
      !keepStatus.current && setIsMouseDown(true);
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
      document.removeEventListener(EVENT_ENUM.SELECTION_CHANGE, selectionChangeHandler);
    };
  }, [editor, wakeUpToolbar, props.readonly]);

  const exec = useMemoFn((param: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
  });

  const HoverMenu = useMemo(
    () => (
      <Menu
        className="menu-toolbar-container"
        onClickMenuItem={exec}
        onMouseUp={e => e.stopPropagation()}
        // Prevent toolbar from taking focus away from editor
        onMouseDown={preventEvent}
        mode="vertical"
        selectedKeys={selectedMarks}
      >
        {MenuItems}
      </Menu>
    ),
    [exec, selectedMarks]
  );

  // 只读状态 / 不可见 / 鼠标按下 时隐藏
  return props.readonly || !visible || isMouseDown ? null : (
    <Portal>
      <div ref={toolbarRef} style={{ left, top }} className="hover-menu-container">
        {HoverMenu}
      </div>
    </Portal>
  );
};
