import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { Popup } from "src/components/popup";
import { setTextNode } from "../../utils/slate-utils";
import { Trigger } from "@arco-design/web-react";
import React, { useState } from "react";
import { Editor } from "slate";
import { TextElement } from "../../types/types";
import HyperLinkMenu from "./menu";
import { ReactEditor, useSlateStatic } from "slate-react";
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
}> = props => {
  const { config } = props;
  const editor = useSlateStatic();
  const [visible, setVisible] = useState(false);

  const clickHref = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  const onConfirm = (value: HyperLinkConfig) => {
    const config = value;
    setVisible(false);
    const path = ReactEditor.findPath(editor, props.element);
    setTextNode(editor, { [hyperLinkPluginKey]: config }, path);
  };

  return (
    <Trigger
      popup={() => <HyperLinkMenu config={config} onConfirm={onConfirm} />}
      position="bottom"
      trigger="click"
      popupVisible={visible}
      onVisibleChange={setVisible}
    >
      <a href={config.href} target={config.blank ? "_blank" : void 0} onClick={clickHref}>
        {props.children}
      </a>
    </Trigger>
  );
};
export const HyperLinkPlugin = (editor: Editor, isRender: boolean): Plugin => {
  return {
    key: hyperLinkPluginKey,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[hyperLinkPluginKey],
    command: (editor, key, data) => {
      const config: HyperLinkConfig = { href: "", blank: true };
      if (data && data.position) {
        const position = data.position;
        return new Promise<void>(resolve => {
          const model = new Popup();
          model.onMaskClick(() => resolve());
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
      }
    },
    render: context => {
      const config = assertValue(context.props.leaf[hyperLinkPluginKey]);
      if (!isRender) {
        return (
          <HyperLinkEditor config={config} element={context.element}>
            {context.children}
          </HyperLinkEditor>
        );
      } else {
        return (
          <a href={config.href} target={config.blank ? "_blank" : void 0}>
            {context.children}
          </a>
        );
      }
    },
  };
};
