import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import { assertValue } from "doc-editor-utils";
import { setTextNode } from "doc-editor-utils";

import { Popup } from "../utils/popup";
import { FontBaseMenu } from "./components/menu";
import type { FontBaseConfig } from "./types";
import { FONT_BASE_KEY } from "./types";

export const FontBasePlugin = (): Plugin => {
  let popupModel: Popup | null = null;

  return {
    key: FONT_BASE_KEY,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[FONT_BASE_KEY],
    command: (editor, key, data) => {
      if (data && data.position && data.marks && !popupModel) {
        const config: FontBaseConfig = data.marks[FONT_BASE_KEY] || {};
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
      const config = assertValue(context.props.leaf[FONT_BASE_KEY]);
      context.style = { ...context.style, ...config };
      return context.children;
    },
  };
};
