import type { EditorSuite } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import { Editor, Transforms } from "doc-editor-delta";
import { getBlockNode } from "doc-editor-utils";
import { isCollapsed, isMatchedEvent } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";
import type { KeyboardEvent } from "react";

import { DIVIDING_LINE_KEY } from "../dividing-line/types";
import { HEADING_KEY } from "../heading/types";
import { ORDERED_LIST_KEY } from "../ordered-list/types";
import { QUOTE_BLOCK_KEY } from "../quote-block/types";
import { UNORDERED_LIST_KEY } from "../unordered-list/types";
import { SHORTCUT_KEY } from "./types";

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

export class ShortCutPlugin extends BlockPlugin {
  public key: string = SHORTCUT_KEY;
  public priority: number = 50;

  constructor(private editor: EditorSuite) {
    super();
  }

  public destroy(): void {}

  public match(): boolean {
    return false;
  }

  public onKeyDown(event: KeyboardEvent<HTMLDivElement>): boolean | void {
    const editor = this.editor;
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
          editor.command.exec(key, { extraKey: data, path });
          event.preventDefault();
        }
      }
    }
  }
}
