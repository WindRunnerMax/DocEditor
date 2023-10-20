import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { Editor, Transforms } from "slate";
import { getBlockNode } from "../../core/ops/get";
import { isCollapsed, isMatchedEvent } from "../../core/ops/is";
import { KEYBOARD } from "../../utils/constant";
import { execCommand, SlateCommands } from "../../core/command";
import { SHORTCUT_KEY } from "./types";
import { ORDERED_LIST_KEY } from "../ordered-list/types";
import { UNORDERED_LIST_KEY } from "../unordered-list/types";
import { QUOTE_BLOCK_KEY } from "../quote-block/types";
import { HEADING_KEY } from "../heading/types";
import { DIVIDING_LINE_KEY } from "../dividing-line/types";

const SHORTCUTS: Record<string, string> = {
  "1.": ORDERED_LIST_KEY,
  "-": UNORDERED_LIST_KEY,
  "*": UNORDERED_LIST_KEY,
  ">": QUOTE_BLOCK_KEY,
  "#": `${HEADING_KEY}.h1`,
  "##": `${HEADING_KEY}.h2`,
  "###": `${HEADING_KEY}.h3`,
  "---": DIVIDING_LINE_KEY,
};

export const ShortCutPlugin = (editor: Editor, commands: SlateCommands): Plugin => {
  return {
    key: SHORTCUT_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    priority: 50,
    match: () => false,
    onKeyDown: event => {
      if (isMatchedEvent(event, KEYBOARD.SPACE) && isCollapsed(editor, editor.selection)) {
        const match = getBlockNode(editor);
        if (match) {
          const { anchor } = editor.selection;
          const { path } = match;
          const start = Editor.start(editor, path);
          const range = { anchor, focus: start };
          const beforeText = Editor.string(editor, range);
          const param = SHORTCUTS[beforeText.trim()];
          if (param) {
            Transforms.select(editor, range);
            Transforms.delete(editor);
            const [key, data] = param.split(".");
            execCommand(editor, commands, key, { extraKey: data, path });
            event.preventDefault();
          }
        }
      }
    },
  };
};
