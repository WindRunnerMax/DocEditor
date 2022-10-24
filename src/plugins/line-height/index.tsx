import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/define/interface";
import { Popup } from "src/components/popup";
import { getBlockNode } from "../../core/ops/get";
import { setBlockNode } from "../../core/ops/set";
import { assertValue } from "src/utils/common";
import { LineHeightMenu } from "./menu";

declare module "slate" {
  interface BlockElement {
    "line-height"?: number;
  }
}

export const lineHeightPluginKey = "line-height";

export const LineHeightPlugin = (): Plugin => {
  let popupModel: Popup | null = null;

  return {
    key: lineHeightPluginKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props => !!props.element[lineHeightPluginKey],
    command: (editor, key, data) => {
      if (data && data.position && !popupModel) {
        let config = 1.8;
        const match = getBlockNode(editor, { key: lineHeightPluginKey });
        if (match) config = assertValue(match.block["line-height"]);
        const position = data.position;
        return new Promise<void>(resolve => {
          const model = new Popup();
          popupModel = model;
          model.onBeforeDestroy(() => {
            popupModel = null;
            resolve();
          });
          model.mount(
            <LineHeightMenu
              config={config}
              left={position.left}
              top={position.top}
              onChange={value => {
                setBlockNode(editor, { [key]: value });
              }}
            />
          );
        }).catch(() => void 0);
      } else if (popupModel) {
        popupModel.destroy();
        popupModel = null;
      }
    },
    renderLine: context => {
      const lineHeight = assertValue(context.props.element[lineHeightPluginKey]);
      return <div style={{ lineHeight }}>{context.children}</div>;
    },
  };
};
