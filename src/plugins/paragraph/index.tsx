import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { PARAGRAPH_KEY } from "./types";
import { getBlockAttributes } from "src/core/ops/get";
import { setUnBlockNode } from "src/core/ops/set";
import { isBlock } from "src/core/ops/is";

export const ParagraphPlugin = (): Plugin => {
  return {
    key: PARAGRAPH_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command: (editor, Key, data) => {
      const element = data.element;
      const path = data.path;
      if (!element || !path || !isBlock(editor, element)) return void 0;
      const attributes = getBlockAttributes(element);
      setUnBlockNode(editor, Object.keys(attributes), { at: path });
    },
    priority: 11,
    match: () => true,
    renderLine: context => <div className="doc-line">{context.children}</div>,
  };
};
