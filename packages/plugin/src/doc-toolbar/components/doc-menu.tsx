import "../index.scss";
import type { Editor, Path } from "slate";
import { Transforms } from "slate";
import { Trigger } from "@arco-design/web-react";
import type { EditorCommands } from "../../../core/command";
import type { RenderElementProps } from "slate-react";
import { ReactEditor } from "slate-react";
import React, { useState } from "react";
import { cs } from "src/utils/classnames";
import { DOC_TOOLBAR_MODULES } from "../modules";
import type { DocToolBarState, DocToolbarPlugin } from "../types";
import type { EditorSchema } from "src/core/schema";
import { isBlockNode, isEmptyLine, isWithinNode } from "../utils/filter";
import { TriggerMenu } from "./trigger-menu";
import { CODE_BLOCK_KEY } from "src/plugins/codeblock/types";
import { REACT_LIVE_KEY } from "src/plugins/react-live/types";
import { HIGHLIGHT_BLOCK_KEY } from "src/plugins/highlight-block/types";

export const DocMenu: React.FC<{
  editor: Editor;
  element: RenderElementProps["element"];
  commands: EditorCommands;
  schema: EditorSchema;
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
    schema: props.schema,
    editor: props.editor,
    element: props.element,
    commands: props.commands,
    status: {
      isBlock: isBlockNode(props.schema, props.element),
      isEmptyLine: isEmptyLine(props.element),
      isInCodeBlock: isWithinNode(props.editor, path, CODE_BLOCK_KEY),
      isInReactLive: isWithinNode(props.editor, path, REACT_LIVE_KEY),
      isInHighLightBlock: isWithinNode(props.editor, path, HIGHLIGHT_BLOCK_KEY),
      isNextLine: false,
    },
    close: onClose,
  };

  let HoverIconConfig: ReturnType<DocToolbarPlugin["renderIcon"]> = null;
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

  // 未匹配到任何`Icon`配置 仅注入`DOM`层级关系
  if (!HoverIconConfig) {
    return <div>{props.children}</div>;
  }

  return (
    <Trigger
      popupVisible={iconVisible}
      onVisibleChange={setIconVisible}
      popup={() => (
        <Trigger
          className="doc-toolbar-trigger"
          popup={() => <TriggerMenu state={state}></TriggerMenu>}
          position="left"
          popupVisible={menuVisible}
          onVisibleChange={setMenuVisible}
        >
          <div className="doc-icon-background">
            <span
              className="doc-icon-container"
              // prevent toolbar from taking focus away from editor
              onMouseDown={e => e.preventDefault()}
              onClick={onSelect}
            >
              {HoverIconConfig && HoverIconConfig.element}
            </span>
          </div>
        </Trigger>
      )}
      position="left"
      mouseLeaveDelay={300}
      mouseEnterDelay={300}
      {...HoverIconConfig.config}
    >
      <div className={cs(menuVisible && "doc-line-hover")}>{props.children}</div>
    </Trigger>
  );
};
