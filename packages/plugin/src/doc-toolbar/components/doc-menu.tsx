import "../index.scss";

import { Trigger } from "@arco-design/web-react";
import type { EditorSchema, EditorSuite } from "doc-editor-core";
import type { Path } from "doc-editor-delta";
import type { RenderElementProps } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";
import { cs, isTextBlock } from "doc-editor-utils";
import React, { useMemo, useState } from "react";

import { CODE_BLOCK_KEY } from "../../codeblock/types";
import { HIGHLIGHT_BLOCK_KEY } from "../../highlight-block/types";
import { REACT_LIVE_KEY } from "../../react-live/types";
import { DOC_TOOLBAR_MODULES } from "../modules";
import type { DocToolbarPlugin, DocToolBarState } from "../types";
import { isBlockNode, isEmptyLine, withinIterator } from "../utils/filter";
import { TriggerMenu } from "./trigger-menu";

export const DocMenu: React.FC<{
  editor: EditorSuite;
  element: RenderElementProps["element"];
  schema: EditorSchema;
}> = props => {
  const [iconVisible, setIconVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const visible = iconVisible || menuVisible;

  const onClose = () => {
    setIconVisible(false);
    setMenuVisible(false);
  };

  const path = useMemo(() => {
    let path: Path = [];
    if (visible) {
      // `Slate`没有直接维护状态 需要主动查找
      // `findPath`不需要遍历所有`Descendant`而是根据两个`WeakMap`查找
      // slate-react/src/plugin/react-editor.ts
      path = ReactEditor.findPath(props.editor, props.element);
    }
    return path;
  }, [visible, props.editor, props.element]);

  const state = useMemo(() => {
    let isInCodeBlock = false;
    let isInReactLive = false;
    let isInHighLightBlock = false;
    if (visible) {
      withinIterator(props.editor, path, node => {
        if (node[CODE_BLOCK_KEY]) isInCodeBlock = true;
        if (node[REACT_LIVE_KEY]) isInReactLive = true;
        if (node[HIGHLIGHT_BLOCK_KEY]) isInHighLightBlock = true;
      });
    }
    const state: DocToolBarState = {
      path: path,
      schema: props.schema,
      editor: props.editor,
      element: props.element,
      status: {
        isBlock: visible && isBlockNode(props.schema, props.element),
        isTextBlock: visible && isTextBlock(props.editor, props.element),
        isEmptyLine: visible && isEmptyLine(props.element),
        isInCodeBlock: isInCodeBlock,
        isInReactLive: isInReactLive,
        isInHighLightBlock: isInHighLightBlock,
        isNextLine: false,
      },
      close: onClose,
    };
    return state;
  }, [path, visible, props.editor, props.element, props.schema]);

  const HoverIconConfig = useMemo(() => {
    let HoverIconConfig: ReturnType<DocToolbarPlugin["renderIcon"]> = null;
    const plugins = DOC_TOOLBAR_MODULES;
    for (const plugin of plugins) {
      const config = plugin.renderIcon(state);
      if (config) {
        HoverIconConfig = config;
        break;
      }
    }
    return HoverIconConfig;
  }, [state]);

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
