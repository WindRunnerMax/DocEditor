import type { EditorKit } from "doc-editor-core";
import { BlockPlugin, EDITOR_EVENT } from "doc-editor-core";
import { Editor, Transforms } from "doc-editor-delta";
import { DEFAULT_PRIORITY, getBlockNode } from "doc-editor-utils";
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
  public priority: number = DEFAULT_PRIORITY + 50;

  constructor(private editor: EditorKit) {
    super();
    this.editor.event.on(EDITOR_EVENT.KEY_DOWN, this.onKeyDown);
  }

  public destroy(): void {
    this.editor.event.off(EDITOR_EVENT.KEY_DOWN, this.onKeyDown);
  }

  public match(): boolean {
    return false;
  }

  public onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const editor = this.editor;
    if (isMatchedEvent(event, KEYBOARD.SPACE) && isCollapsed(editor.raw, editor.raw.selection)) {
      const match = getBlockNode(editor.raw);
      if (match) {
        const { anchor } = editor.raw.selection;
        const { path } = match;
        const start = Editor.start(editor.raw, path);
        const range = { anchor, focus: start };
        const beforeText = Editor.string(editor.raw, range);
        const param = SHORTCUTS[beforeText.trim()];
        if (param) {
          Transforms.select(editor.raw, range);
          Transforms.delete(editor.raw);
          const [key, data] = param.split(".");
          editor.command.exec(key, { extraKey: data, path });
          event.preventDefault();
        }
      }
    }
  };
}
