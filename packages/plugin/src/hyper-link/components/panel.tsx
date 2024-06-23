import { Trigger } from "@arco-design/web-react";
import type { EditorKit } from "doc-editor-core";
import type { TextElement } from "doc-editor-delta";
import { findNodePath, isCollapsed, setTextNode, setUnTextNode } from "doc-editor-utils";
import React, { useState } from "react";

import type { HyperLinkConfig } from "../types";
import { HYPER_LINK_KEY } from "../types";
import { HyperLinkMenu } from "./menu";

export const HyperLinkEditor: React.FC<{
  config: HyperLinkConfig;
  element: TextElement;
  editor: EditorKit;
}> = props => {
  const { config } = props;
  const editor = props.editor;
  const [visible, setVisible] = useState(false);

  const clickHref = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  const onConfirm = (value: HyperLinkConfig) => {
    const config = value;
    setVisible(false);
    const path = findNodePath(editor.raw, props.element);
    path && setTextNode(editor.raw, { [HYPER_LINK_KEY]: config }, { at: path });
  };

  const onCancel = () => {
    setVisible(false);
    const path = findNodePath(editor.raw, props.element);
    path && setUnTextNode(editor.raw, [HYPER_LINK_KEY], { at: path });
  };

  const onVisibleChange = (visible: boolean) => {
    if ((visible && isCollapsed(editor.raw)) || !visible) {
      setVisible(visible);
    }
  };

  return (
    <Trigger
      popup={() => <HyperLinkMenu config={config} onConfirm={onConfirm} onCancel={onCancel} />}
      position="bottom"
      trigger="click"
      popupVisible={visible}
      onVisibleChange={onVisibleChange}
    >
      <span className="hyper-link" onClick={clickHref}>
        {props.children}
      </span>
    </Trigger>
  );
};
