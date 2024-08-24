import { Trigger } from "@arco-design/web-react";
import type { EditorKit } from "doc-editor-core";
import type { Path, RenderElementProps } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";
import { cs, isTextBlock } from "doc-editor-utils";
import React, { useMemo, useState } from "react";

import { CODE_BLOCK_KEY } from "../../codeblock/types";
import { HIGHLIGHT_BLOCK_KEY } from "../../highlight-block/types";
import { REACT_LIVE_KEY } from "../../react-live/types";
import { TABLE_CELL_BLOCK_KEY } from "../../table/types/index";
import type { DocToolbarPlugin, DocToolBarState } from "../types";
import { isEmptyLine, withinIterator } from "../utils/filter";
import { TriggerMenu } from "./trigger-menu";

export const DocMenu: React.FC<{
  editor: EditorKit;
  plugins: DocToolbarPlugin[];
  element: RenderElementProps["element"];
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
      path = ReactEditor.findPath(props.editor.raw, props.element);
    } catch (error) {
      props.editor.logger.warning("ToolBar FindPath Error", error);
    }
    return path;
  }, [props.editor, props.element]);

  const state = useMemo(() => {
    let isInCodeBlock = false;
    let isInReactLive = false;
    let isInHighLightBlock = false;
    let isInTableBlock = false;
    withinIterator(props.editor.raw, path, node => {
      if (node[CODE_BLOCK_KEY]) isInCodeBlock = true;
      if (node[REACT_LIVE_KEY]) isInReactLive = true;
      if (node[HIGHLIGHT_BLOCK_KEY]) isInHighLightBlock = true;
      if (node[TABLE_CELL_BLOCK_KEY]) isInTableBlock = true;
    });
    const state: DocToolBarState = {
      path: path,
      editor: props.editor,
      element: props.element,
      status: {
        isBlock: props.editor.reflex.isBlockNode(props.element),
        isTextBlock: isTextBlock(props.editor.raw, props.element),
        isEmptyLine: isEmptyLine(props.element),
        isInCodeBlock: isInCodeBlock,
        isInReactLive: isInReactLive,
        isInHighLightBlock: isInHighLightBlock,
        isNextLine: false,
        isInTableBlock: isInTableBlock,
      },
      close: onClose,
    };
    return state;
  }, [path, props.editor, props.element]);

  const HoverIconConfig = useMemo(() => {
    let HoverIconConfig: ReturnType<DocToolbarPlugin["renderIcon"]> = null;
    const plugins = props.plugins;
    for (const plugin of plugins) {
      const config = plugin.renderIcon(state);
      if (config) {
        HoverIconConfig = config;
        break;
      }
    }
    return HoverIconConfig;
  }, [props.plugins, state]);

  const onSelect = () => {
    ReactEditor.focus(props.editor.raw);
    Transforms.select(props.editor.raw, path);
    onClose();
  };

  // 未匹配到任何`Icon`配置
  if (!HoverIconConfig) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  return (
    <Trigger
      popupVisible={iconVisible}
      onVisibleChange={setIconVisible}
      popup={() => (
        <Trigger
          className="doc-toolbar-trigger"
          popup={() => <TriggerMenu state={state} plugins={props.plugins}></TriggerMenu>}
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
      autoFitPosition={false}
      {...HoverIconConfig.config}
    >
      <div data-doc-toolbar className={cs(menuVisible && "doc-line-hover")}>
        {props.children}
      </div>
    </Trigger>
  );
};
