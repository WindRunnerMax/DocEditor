import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { Popup } from "src/components/popup";
import { getBlockNode, setBlockNode } from "../../utils/slate-utils";
import { assertValue } from "src/utils/common";
import { LineHeightMenu } from "./menu";

declare module "slate" {
  interface BlockElement {
    "line-height"?: number;
  }
}

export const lineHeightPluginKey = "line-height";

export const LineHeightPlugin = (): Plugin => {
  return {
    key: lineHeightPluginKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props => !!props.element[lineHeightPluginKey],
    command: (editor, key, data) => {
      if (data && data.position) {
        let config = 1.8;
        const match = getBlockNode(editor, { key: lineHeightPluginKey });
        if (match) config = assertValue(match.block["line-height"]);
        const position = data.position;
        return new Promise<void>(resolve => {
          const model = new Popup();
          model.onMaskClick(() => resolve());
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
      }
    },
    renderLine: context => {
      const lineHeight = assertValue(context.props.element[lineHeightPluginKey]);
      return <div style={{ lineHeight }}>{context.children}</div>;
    },
  };
};
