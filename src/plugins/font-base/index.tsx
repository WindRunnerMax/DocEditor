import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { Popup } from "src/components/popup";
import { setTextNode } from "../../utils/slate-utils";
import { assertValue } from "src/utils/common";
import { FontBaseMenu } from "./menu";

declare module "slate" {
  interface TextElement {
    "font-base"?: FontBaseConfig;
  }
}

export type FontBaseConfig = {
  fontSize?: number;
  color?: string;
  background?: string;
};
export const fontBasePluginKey = "font-base";

export const FontBasePlugin = (): Plugin => {
  return {
    key: fontBasePluginKey,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[fontBasePluginKey],
    command: (editor, key, data) => {
      if (data && data.position && data.marks) {
        const config: FontBaseConfig = data.marks[fontBasePluginKey] || {};
        const position = data.position;
        return new Promise<void>(resolve => {
          const model = new Popup();
          model.onMaskClick(() => resolve());
          model.mount(
            <FontBaseMenu
              config={config}
              left={position.left}
              top={position.top}
              onChange={value => {
                setTextNode(editor, { [key]: value });
              }}
            />
          );
        }).catch(() => void 0);
      }
    },
    render: context => {
      const config = assertValue(context.props.leaf[fontBasePluginKey]);
      context.style = { ...context.style, ...config };
      return context.children;
    },
  };
};
