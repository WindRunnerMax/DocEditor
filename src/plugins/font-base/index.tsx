import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/define/interface";
import { Popup } from "src/components/popup";
import { setTextNode } from "../../core/ops/set";
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
  let popupModel: Popup | null = null;

  return {
    key: fontBasePluginKey,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[fontBasePluginKey],
    command: (editor, key, data) => {
      if (data && data.position && data.marks && !popupModel) {
        const config: FontBaseConfig = data.marks[fontBasePluginKey] || {};
        const position = data.position;
        return new Promise<void>(resolve => {
          const model = new Popup();
          popupModel = model;
          model.onBeforeDestroy(() => {
            popupModel = null;
            resolve();
          });
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
      } else if (popupModel) {
        popupModel.destroy();
        popupModel = null;
      }
    },
    render: context => {
      const config = assertValue(context.props.leaf[fontBasePluginKey]);
      context.style = { ...context.style, ...config };
      return context.children;
    },
  };
};
