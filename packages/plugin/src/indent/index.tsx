import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import type { Editor } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { isCollapsed, isMatchedEvent } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";

import { INDENT_KEY } from "./types";

export const IndentPlugin = (editor: Editor): Plugin => {
  return {
    key: INDENT_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    priority: -1,
    match: () => false,
    onKeyDown: event => {
      if (isMatchedEvent(event, KEYBOARD.TAB) && isCollapsed(editor, editor.selection)) {
        Transforms.insertText(editor, "\t");
        event.preventDefault();
        event.stopPropagation();
      }
    },
  };
};
