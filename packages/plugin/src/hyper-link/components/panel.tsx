import { Trigger } from "@arco-design/web-react";
import type { EditorSuite } from "doc-editor-core";
import type { TextElement } from "doc-editor-delta";
import { findNodePath, isCollapsed, setTextNode, setUnTextNode } from "doc-editor-utils";
import React, { useState } from "react";

import type { HyperLinkConfig } from "../types";
import { HYPER_LINK_KEY } from "../types";
import { HyperLinkMenu } from "./menu";

export const HyperLinkEditor: React.FC<{
  config: HyperLinkConfig;
  element: TextElement;
  editor: EditorSuite;
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
    const path = findNodePath(editor, props.element);
    path && setTextNode(editor, { [HYPER_LINK_KEY]: config }, { at: path });
  };

  const onCancel = () => {
    setVisible(false);
    const path = findNodePath(editor, props.element);
    path && setUnTextNode(editor, [HYPER_LINK_KEY], { at: path });
  };

  const onVisibleChange = (visible: boolean) => {
    if ((visible && isCollapsed(editor)) || !visible) {
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
