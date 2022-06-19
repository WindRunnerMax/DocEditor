import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { Editor, Transforms } from "slate";
import { getBlockNode, isCollapsed, isMatchedEvent } from "../../utils/slate-utils";
import { KEYBOARD } from "../../utils/constant";
import { execCommand, SlateCommands } from "../../utils/slate-commands";

const SHORTCUTS: Record<string, string> = {
  "1.": "ordered-list",
  "-": "unordered-list",
  "*": "unordered-list",
  ">": "quote-block",
  "#": "heading.h1",
  "##": "heading.h2",
  "###": "heading.h3",
  "---": "dividing-line",
};

export const ShortCutPlugin = (editor: Editor, commands: SlateCommands): Plugin => {
  return {
    key: "shortcut",
    type: EDITOR_ELEMENT_TYPE.BLOCK,
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
