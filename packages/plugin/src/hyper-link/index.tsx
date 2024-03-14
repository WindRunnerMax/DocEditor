import { Trigger } from "@arco-design/web-react";
import type { EditorSuite, Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import type { TextElement } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";
import { isCollapsed } from "doc-editor-utils";
import { assertValue } from "doc-editor-utils";
import { setTextNode, setUnTextNode } from "doc-editor-utils";
import React, { useState } from "react";

import { Popup } from "../utils/popup";
import { HyperLinkMenu } from "./components/menu";
import type { HyperLinkConfig } from "./types";
import { HYPER_LINK_KEY } from "./types";

const HyperLinkEditor: React.FC<{
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
    const path = ReactEditor.findPath(editor, props.element);
    setTextNode(editor, { [HYPER_LINK_KEY]: config }, { at: path });
  };

  const onCancel = () => {
    setVisible(false);
    const path = ReactEditor.findPath(editor, props.element);
    setUnTextNode(editor, [HYPER_LINK_KEY], { at: path });
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
export const HyperLinkPlugin = (editor: EditorSuite, readonly: boolean): Plugin => {
  let popupModel: Popup | null = null;
  return {
    key: HYPER_LINK_KEY,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[HYPER_LINK_KEY],
    command: (editor, key, data) => {
      if (data && data.position && data.marks && !popupModel) {
        const position = data.position;
        const config: HyperLinkConfig = data.marks[HYPER_LINK_KEY] || { href: "", blank: true };
        return new Promise<void>(resolve => {
          const model = new Popup();
          popupModel = model;
          model.onBeforeDestroy(() => {
            popupModel = null;
            resolve();
          });
          model.mount(
            <HyperLinkMenu
              config={config}
              left={position.left}
              top={position.top}
              onConfirm={value => {
                config.href = value.href;
                config.blank = value.blank;
                setTextNode(editor, { [key]: config });
                model.destroy();
              }}
              onCancel={() => {
                setUnTextNode(editor, [key]);
                model.destroy();
              }}
            />
          );
        }).catch(() => void 0);
      } else if (popupModel) {
        popupModel.destroy();
        popupModel = null;
      }
    },
    render: context => {
      const config = assertValue(context.props.leaf[HYPER_LINK_KEY]);
      if (!readonly) {
        return (
          <HyperLinkEditor config={config} element={context.element} editor={editor}>
            {context.children}
          </HyperLinkEditor>
        );
      } else {
        return (
          <a className="hyper-link" href={config.href} target={config.blank ? "_blank" : void 0}>
            {context.children}
          </a>
        );
      }
    },
  };
};
