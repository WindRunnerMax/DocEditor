import "./index.scss";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "slate";
import { Menu } from "@arco-design/web-react";
import ReactDOM from "react-dom";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconCode,
  IconFontColors,
  IconItalic,
  IconLineHeight,
  IconLink,
  IconMenu,
  IconStrikethrough,
  IconUnderline,
} from "@arco-design/web-react/icon";
import { useMemoizedFn } from "ahooks";
import { execCommand, SlateCommands } from "../../utils/slate-commands";
import { focusSelection, isCollapsed } from "../../utils/slate-utils";
import { getSelectionRect, maskMenuToolBar } from "./utils";
import { useFocused, useSlate } from "slate-react";
import { paragraphKey } from "../paragraph";
import { boldPluginKey } from "../bold";
import { italicPluginKey } from "../italic";
import { underLinePluginKey } from "../under-line";
import { strikeThroughPluginKey } from "../strike-through";
import { inlineCodePluginKey } from "../inline-code";
import { hyperLinkPluginKey } from "../hyper-link";
import { fontBasePluginKey } from "../font-base";
import { lineHeightPluginKey } from "../line-height";
import { alignKey } from "../align";

export const Portal: React.FC = ({ children }) => {
  return typeof document === "object" ? ReactDOM.createPortal(children, document.body) : null;
};

const MenuItems = (
  <>
    <Menu.Item key={paragraphKey}>
      <i className="iconfont icon-text arco-icon" />
    </Menu.Item>
    <Menu.Item key={boldPluginKey}>
      <IconBold />
    </Menu.Item>
    <Menu.Item key={italicPluginKey}>
      <IconItalic />
    </Menu.Item>
    <Menu.Item key={underLinePluginKey}>
      <IconUnderline />
    </Menu.Item>
    <Menu.Item key={strikeThroughPluginKey}>
      <IconStrikethrough />
    </Menu.Item>
    <Menu.Item key={inlineCodePluginKey}>
      <IconCode />
    </Menu.Item>
    <Menu.Item key={hyperLinkPluginKey}>
      <IconLink />
    </Menu.Item>
    <Menu.Item key={fontBasePluginKey}>
      <IconFontColors />
    </Menu.Item>
    <Menu.Item key={lineHeightPluginKey}>
      <IconLineHeight />
    </Menu.Item>
    <Menu.SubMenu
      key={alignKey}
      title={<IconAlignLeft />}
      popup
      triggerProps={{ trigger: "click", position: "bottom" }}
    >
      <Menu.Item key={`${alignKey}.left`}>
        <div className="align-menu-center">
          <IconAlignLeft />
        </div>
      </Menu.Item>
      <Menu.Item key={`${alignKey}.center`}>
        <div className="align-menu-center">
          <IconAlignCenter />
        </div>
      </Menu.Item>
      <Menu.Item key={`${alignKey}.right`}>
        <div className="align-menu-center">
          <IconAlignRight />
        </div>
      </Menu.Item>
      <Menu.Item key={`${alignKey}.justify`}>
        <div className="align-menu-center">
          <IconMenu />
        </div>
      </Menu.Item>
    </Menu.SubMenu>
  </>
);

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
    };
    const mouseDownHandler = () => {
      if (keepToolBar.current) return void 0;
      setIsKeyDown(true);
    };
    document.addEventListener("mouseup", mouseUpHandler);
    document.addEventListener("mousedown", mouseDownHandler);
    return () => {
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("mousedown", mouseDownHandler);
    };
  }, []);

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
      const hideToolBarAndFocusEditor = () => {
        menuRef.current && maskMenuToolBar(menuRef.current);
        focusSelection(editor);
      };

      const marks = Editor.marks(editor);
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
        result.then(() => {
          keepToolBar.current = false;
          hideToolBarAndFocusEditor();
        });
      } else {
        hideToolBarAndFocusEditor();
      }
    }
  );

  const HoverMenu = useMemo(
    () => (
      <Menu
        className="menu-toolbar-container"
        onClickMenuItem={exec}
        selectable={false}
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
        }} // prevent toolbar from taking focus away from editor
        mode="vertical"
      >
        {MenuItems}
      </Menu>
    ),
    [exec]
  );

  return props.isRender ? null : (
    <Portal>
      <div ref={menuRef} className="hover-menu-container">
        {HoverMenu}
      </div>
    </Portal>
  );
};
