import "../index.scss";

import { Trigger } from "@arco-design/web-react";
import type { EditorSchema, EditorSuite } from "doc-editor-core";
import type { Path, RenderElementProps } from "doc-editor-delta";
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

  const onClose = () => {
    setIconVisible(false);
    setMenuVisible(false);
  };

  const path = useMemo(() => {
    let path: Path = [];
    try {
      // `Slate`没有直接维护状态 需要主动查找
      // 注意即使在非`visible`的状态下也需要查找 否则会导致节点闪烁问题
      // `findPath`不需要遍历所有`Descendant`而是根据两个`WeakMap`查找
      // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/react-editor.ts#L100
      path = ReactEditor.findPath(props.editor, props.element);
    } catch (error) {
      props.editor.logger.warning("ToolBar FindPath Error", error);
    }
    return path;
  }, [props.editor, props.element]);

  const state = useMemo(() => {
    let isInCodeBlock = false;
    let isInReactLive = false;
    let isInHighLightBlock = false;
    withinIterator(props.editor, path, node => {
      if (node[CODE_BLOCK_KEY]) isInCodeBlock = true;
      if (node[REACT_LIVE_KEY]) isInReactLive = true;
      if (node[HIGHLIGHT_BLOCK_KEY]) isInHighLightBlock = true;
    });
    const state: DocToolBarState = {
      path: path,
      schema: props.schema,
      editor: props.editor,
      element: props.element,
      status: {
        isBlock: isBlockNode(props.schema, props.element),
        isTextBlock: isTextBlock(props.editor, props.element),
        isEmptyLine: isEmptyLine(props.element),
        isInCodeBlock: isInCodeBlock,
        isInReactLive: isInReactLive,
        isInHighLightBlock: isInHighLightBlock,
        isNextLine: false,
      },
      close: onClose,
    };
    return state;
  }, [path, props.editor, props.element, props.schema]);

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
      <div data-doc-toolbar className={cs(menuVisible && "doc-line-hover")}>
        {props.children}
      </div>
    </Trigger>
  );
};
