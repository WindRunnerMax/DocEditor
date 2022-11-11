import "./index.scss";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "slate";
import { Menu } from "@arco-design/web-react";
import { useMemoizedFn } from "ahooks";
import { execCommand, SlateCommands } from "../../core/define/commands";
import { execSelectMarks, getSelectionRect, maskMenuToolBar, Portal } from "./utils";
import { useFocused } from "slate-react";
import { MenuItems } from "./menu";
import { fontBasePluginKey } from "../font-base";
import { hyperLinkPluginKey } from "../hyper-link";
import { lineHeightPluginKey } from "../line-height";
import { omit } from "src/utils/filter";
import { EVENT_ENUM } from "src/utils/constant";

const TOOLBAR_OFFSET_HEIGHT = 40;
const TOOLBAR_OFFSET_WIDTH = 340;

const NOT_INIT_SELECT = [hyperLinkPluginKey, fontBasePluginKey];
const MUTEX_SELECT = [...NOT_INIT_SELECT, lineHeightPluginKey];
export const MenuToolBar: FC<{
  isRender: boolean;
  editor: Editor;
  commands: SlateCommands;
}> = props => {
  const editor = props.editor;
  const inFocus = useFocused();
  const keepToolBar = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedMarks, setSelectedMarks] = useState<string[]>([]);

  const wakeUpToolbar = useMemoizedFn((wakeUp: boolean) => {
    const toolbar = menuRef.current;
    if (!toolbar) return void 0;
    if (inFocus && wakeUp) {
      setSelectedMarks(omit(Object.keys(Editor.marks(editor) || []), NOT_INIT_SELECT));
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
    const toolbar = menuRef.current;
    if (!toolbar) return void 0;
    const mouseUpHandler = () => {
      if (keepToolBar.current) return void 0;
      toolbar.style.display = "";
    };
    const mouseDownHandler = () => {
      if (keepToolBar.current) return void 0;
      toolbar.style.display = "none";
    };
    const selectionChangeHandler = () => {
      if (keepToolBar.current) return void 0;
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
  }, [editor, wakeUpToolbar]);

  const exec = useMemoizedFn(
    (param: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const [key, data] = param.split(".");
      const marks = Editor.marks(editor);
      setSelectedMarks(execSelectMarks(key, selectedMarks, MUTEX_SELECT));
      const position = { left: 0, top: 0 };
      if (menuRef.current) {
        position.top = menuRef.current.offsetTop + menuRef.current.offsetHeight / 2;
        position.left = menuRef.current.offsetLeft + menuRef.current.offsetWidth / 2;
      }
      const result = execCommand(editor, props.commands, key, {
        extraKey: data,
        event,
        position,
        marks,
      });
      if (result) {
        keepToolBar.current = true;
        result.then(() => (keepToolBar.current = false));
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
          e.preventDefault();
          e.stopPropagation();
        }} // prevent toolbar from taking focus away from editor
        mode="vertical"
        selectedKeys={selectedMarks}
      >
        {MenuItems}
      </Menu>
    ),
    [exec, selectedMarks]
  );

  return props.isRender ? null : (
    <Portal>
      <div ref={menuRef} className="hover-menu-container">
        {HoverMenu}
      </div>
    </Portal>
  );
};
