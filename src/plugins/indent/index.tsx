import type { Plugin } from "../../core/plugin/interface";
import { EDITOR_ELEMENT_TYPE } from "../../core/plugin/interface";
import type { Editor } from "slate";
import { Transforms } from "slate";
import { isCollapsed, isMatchedEvent } from "../../core/ops/is";
import { KEYBOARD } from "../../utils/constant";
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
