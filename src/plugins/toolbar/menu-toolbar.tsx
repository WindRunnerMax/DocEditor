import "./index.scss";
import React, { FC, useEffect, useMemo, useRef } from "react";
import { Editor } from "slate";
import { Menu } from "@arco-design/web-react";
import ReactDOM from "react-dom";
import {
  IconBold,
  IconCode,
  IconFontColors,
  IconItalic,
  IconLink,
  IconStrikethrough,
  IconUnderline,
} from "@arco-design/web-react/icon";
import { useMemoizedFn } from "ahooks";
import { execCommand } from "../../utils/commands";
import { debounce } from "lodash";
import { focusSelection, isCollapsed } from "../../utils/slate-utils";
import { getSelectionRect, maskMenuToolBar, toNormalText } from "./utils";

export const Portal: React.FC = ({ children }) => {
  return typeof document === "object" ? ReactDOM.createPortal(children, document.body) : null;
};

export const MenuToolBar: FC<{
  editor: Editor;
  slateRef: React.RefObject<HTMLDivElement>;
  isRender: boolean;
}> = props => {
  const menuRef = useRef<HTMLDivElement>(null);

  const affixStyles = useMemoizedFn(
    (param: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const [key, data] = param.split(".");
      const hideToolBarAndFocusEditor = () => {
        menuRef.current && maskMenuToolBar(menuRef.current);
        focusSelection(props.editor);
      };
      if (key === "normal") {
        toNormalText(props.editor);
        hideToolBarAndFocusEditor();
      } else {
        const position = { left: 0, top: 0 };
        if (menuRef.current) {
          position.top = menuRef.current.offsetTop + menuRef.current.offsetHeight / 2;
          position.left = menuRef.current.offsetLeft + menuRef.current.offsetWidth / 2;
        }
        const result = execCommand(props.editor, key, { extraKey: data, event, position });
        if (result) result.then(hideToolBarAndFocusEditor);
        else hideToolBarAndFocusEditor();
      }
    }
  );

  const HoverMenu = useMemo(
    () => (
      <Menu
        className="menu-toolbar-menu-container"
        onClickMenuItem={affixStyles}
        selectable={false}
      >
        <Menu.Item key="normal">
          <IconFontColors />
        </Menu.Item>
        <Menu.Item key="bold">
          <IconBold />
        </Menu.Item>
        <Menu.Item key="italic">
          <IconItalic />
        </Menu.Item>
        <Menu.Item key="under-line">
          <IconUnderline />
        </Menu.Item>
        <Menu.Item key="strike-through">
          <IconStrikethrough />
        </Menu.Item>
        <div className="cut-line"></div>
        <Menu.Item key="inline-code">
          <IconCode />
        </Menu.Item>
        <Menu.Item key="link">
          <IconLink />
        </Menu.Item>
      </Menu>
    ),
    [affixStyles]
  );

  useEffect(() => {
    const toolbar = menuRef.current;
    const element = props.slateRef.current;
    if (!element || !toolbar) return void 0;

    const mouseDownHandler = debounce(() => {
      const mouseUpHandler = () => {
        document.removeEventListener("mouseup", mouseUpHandler);
        if (isCollapsed(props.editor)) {
          maskMenuToolBar(toolbar);
          return void 0;
        }
        const rect = getSelectionRect();
        if (rect) {
          toolbar.style.opacity = "1";
          toolbar.style.top = `${rect.top + window.pageYOffset - toolbar.offsetHeight - 10}px`;
          toolbar.style.left = `${
            rect.left + window.pageXOffset - toolbar.offsetWidth / 2 + rect.width / 2
          }px`;
        }
      };
      maskMenuToolBar(toolbar);
      document.addEventListener("mouseup", mouseUpHandler);
    }, 50);

    element.addEventListener("mousedown", mouseDownHandler);
    return () => {
      element.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [props.editor, props.slateRef]);

  return props.isRender ? null : (
    <Portal>
      <div ref={menuRef} className="hover-menu-container">
        {HoverMenu}
      </div>
    </Portal>
  );
};
