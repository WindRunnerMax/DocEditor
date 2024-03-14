import "./index.scss";

import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import { getBlockAttributes } from "doc-editor-utils";
import { isBlock } from "doc-editor-utils";
import { setUnBlockNode } from "doc-editor-utils";

import { PARAGRAPH_KEY } from "./types";

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
