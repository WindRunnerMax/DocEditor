import "./index.scss";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "slate";
import { Menu } from "@arco-design/web-react";
import { useMemoizedFn } from "ahooks";
import { execCommand, SlateCommands } from "../../utils/slate-commands";
import { getOmitAttributes, isCollapsed } from "../../utils/slate-utils";
import { getSelectionRect, maskMenuToolBar, Portal } from "./utils";
import { useFocused, useSlate } from "slate-react";
import { MenuItems } from "./menu";
import { fontBasePluginKey } from "../font-base";

const NOT_INIT_SELECT = [fontBasePluginKey];
export const MenuToolBar: FC<{
  isRender: boolean;
  commands: SlateCommands;
}> = props => {
  const editor = useSlate();
  const inFocus = useFocused();
  const keepToolBar = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isKeyDown, setIsKeyDown] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedMarks, setSelectedMarks] = useState<string[]>([]);

  useEffect(() => {
    const toolbar = menuRef.current;
    if (!toolbar) return void 0;
    if (isSelected && !isKeyDown) {
      const rect = getSelectionRect();
      if (rect) {
        toolbar.style.opacity = "1";
        toolbar.style.top = `${rect.top + window.pageYOffset - toolbar.offsetHeight - 10}px`;
        toolbar.style.left = `${
          rect.left + window.pageXOffset - toolbar.offsetWidth / 2 + rect.width / 2
        }px`;
      }
    } else {
      maskMenuToolBar(toolbar);
    }
  }, [isKeyDown, isSelected, editor]);

  useEffect(() => {
    const toolbar = menuRef.current;
    if (!toolbar) return void 0;
    const mouseUpHandler = () => {
      if (keepToolBar.current) return void 0;
      setIsKeyDown(false);
      setSelectedMarks(
        getOmitAttributes(Object.keys(Editor.marks(editor) || []), NOT_INIT_SELECT).list
      );
    };
    const mouseDownHandler = () => {
      if (keepToolBar.current) return void 0;
      setIsKeyDown(true);
      maskMenuToolBar(toolbar);
    };
    document.addEventListener("mouseup", mouseUpHandler);
    document.addEventListener("mousedown", mouseDownHandler);
    return () => {
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [editor]);

  useEffect(() => {
    if (
      !editor.selection ||
      !inFocus ||
      isCollapsed(editor) ||
      Editor.string(editor, editor.selection) === ""
    ) {
      !keepToolBar.current && setIsSelected(false);
    } else {
      setIsSelected(true);
    }
  }, [editor, editor.selection, inFocus]);

  const exec = useMemoizedFn(
    (param: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const [key, data] = param.split(".");
      const marks = Editor.marks(editor);
      const isInMarks = selectedMarks.indexOf(key) > -1;
      setSelectedMarks(
        isInMarks ? getOmitAttributes(selectedMarks, [key]).list : [key, ...selectedMarks]
      );
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
