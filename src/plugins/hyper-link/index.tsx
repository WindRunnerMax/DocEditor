import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { Popup } from "src/components/popup";
import { setTextNode, setUnTextNode } from "../../utils/slate-utils";
import { Trigger } from "@arco-design/web-react";
import React, { useState } from "react";
import { Editor } from "slate";
import { TextElement } from "../../types/types";
import HyperLinkMenu from "./menu";
import { ReactEditor } from "slate-react";
import { assertValue } from "src/utils/common";

declare module "slate" {
  interface TextElement {
    "link"?: HyperLinkConfig;
  }
}

export type HyperLinkConfig = {
  href: string;
  blank: boolean;
};
export const hyperLinkPluginKey = "link";

const HyperLinkEditor: React.FC<{
  config: HyperLinkConfig;
  element: TextElement;
  editor: Editor;
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
    setTextNode(editor, { [hyperLinkPluginKey]: config }, { at: path });
  };

  return (
    <Trigger
      popup={() => <HyperLinkMenu config={config} onConfirm={onConfirm} />}
      position="bottom"
      trigger="click"
      popupVisible={visible}
      onVisibleChange={setVisible}
    >
      <span className="hyper-link" onClick={clickHref}>
        {props.children}
      </span>
    </Trigger>
  );
};
export const HyperLinkPlugin = (editor: Editor, isRender: boolean): Plugin => {
  let popupModel: Popup | null = null;
  return {
    key: hyperLinkPluginKey,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[hyperLinkPluginKey],
    command: (editor, key, data) => {
      if (data && data.position && data.marks && !data.marks[key]) {
        if (!popupModel) {
          const position = data.position;
          const config: HyperLinkConfig = { href: "", blank: true };
          return new Promise<void>(resolve => {
            const model = new Popup();
            popupModel = model;
            model.onBeforeClose(() => {
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
                  resolve();
                }}
              />
            );
          }).catch(() => void 0);
        } else {
          popupModel.destroy();
          popupModel = null;
        }
      } else {
        setUnTextNode(editor, [key]);
      }
    },
    render: context => {
      const config = assertValue(context.props.leaf[hyperLinkPluginKey]);
      if (!isRender) {
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
