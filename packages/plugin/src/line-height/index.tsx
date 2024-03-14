import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import { assertValue } from "doc-editor-utils";
import { getBlockNode } from "doc-editor-utils";
import { setBlockNode } from "doc-editor-utils";

import { Popup } from "../utils/popup";
import { LineHeightMenu } from "./components/menu";
import { LINE_HEIGHT_KEY } from "./types";

export const LineHeightPlugin = (): Plugin => {
  let popupModel: Popup | null = null;

  return {
    key: LINE_HEIGHT_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props => !!props.element[LINE_HEIGHT_KEY],
    command: (editor, key, data) => {
      if (data && data.position && !popupModel) {
        let config = 1.8;
        const match = getBlockNode(editor, { key: LINE_HEIGHT_KEY });
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
      const lineHeight = assertValue(context.props.element[LINE_HEIGHT_KEY]);
      return <div style={{ lineHeight }}>{context.children}</div>;
    },
  };
};
