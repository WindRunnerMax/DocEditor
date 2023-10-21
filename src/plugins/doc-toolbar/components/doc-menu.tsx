import "../index.scss";
import { Editor, Path, Transforms } from "slate";
import { IconPlus } from "@arco-design/web-react/icon";
import { Trigger } from "@arco-design/web-react";
import { EditorCommands } from "../../../core/command";
import { ReactEditor, RenderElementProps } from "slate-react";
import React, { useState } from "react";
import { cs } from "src/utils/classnames";
import { DOC_TOOLBAR_MODULES } from "../modules";
import { DocToolBarState, DocToolbarPlugin } from "../types";

export const DocMenu: React.FC<{
  editor: Editor;
  element: RenderElementProps["element"];
  commands: EditorCommands;
}> = props => {
  const [iconVisible, setIconVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  let path: Path = [];
  if (iconVisible || menuVisible) {
    // `Slate`没有直接维护状态 需要主动查找
    // `findPath`不需要遍历所有`Descendant`而是根据两个`WeakMap`查找
    // slate-react/src/plugin/react-editor.ts
    path = ReactEditor.findPath(props.editor, props.element);
  }
  const onClose = () => {
    setIconVisible(false);
    setMenuVisible(false);
  };

  const plugins = DOC_TOOLBAR_MODULES;
  const state: DocToolBarState = {
    path: path,
    editor: props.editor,
    element: props.element,
    commands: props.commands,
    status: {
      isInCodeBlock: false,
    },
    close: onClose,
  };

  let HoverIconConfig: Exclude<ReturnType<DocToolbarPlugin["renderIcon"]>, null> = {
    element: <IconPlus />,
  };
  for (const plugin of plugins) {
    const config = plugin.renderIcon(state);
    if (config) {
      HoverIconConfig = config;
      break;
    }
  }

  const onSelect = () => {
    ReactEditor.focus(props.editor);
    Transforms.select(props.editor, path);
    onClose();
  };

  return (
    <Trigger
      popupVisible={iconVisible}
      onVisibleChange={setIconVisible}
      popup={() => (
        <Trigger
          className="doc-menu-popup"
          popup={() => <div></div>}
          position="left"
          popupVisible={menuVisible}
          onVisibleChange={setMenuVisible}
        >
          <span
            className="doc-icon-container"
            // prevent toolbar from taking focus away from editor
            onMouseDown={e => e.preventDefault()}
            onClick={onSelect}
          >
            {HoverIconConfig.element}
          </span>
        </Trigger>
      )}
      position="left"
      mouseLeaveDelay={200}
      mouseEnterDelay={200}
      {...HoverIconConfig.config}
    >
      <div className={cs(menuVisible && "doc-line-hover")}>{props.children}</div>
    </Trigger>
  );
};
