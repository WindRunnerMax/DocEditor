import type { EditorKit } from "doc-editor-core";
import { BlockPlugin, EDITOR_EVENT } from "doc-editor-core";
import type { TextElement } from "doc-editor-delta";
import { Editor, Transforms } from "doc-editor-delta";
import { Bind, DEFAULT_PRIORITY, getBlockNode } from "doc-editor-utils";
import { isMatchedEvent } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";
import type { KeyboardEvent } from "react";

import { COMMAND_SHORTCUTS, SHORTCUT_KEY, SHORTCUTS } from "./types";

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

  @Bind
  public onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const editor = this.editor;
    const sel = editor.selection.get();
    if (!sel) return null;
    if (isMatchedEvent(event, KEYBOARD.SPACE) && sel.isCollapsed) {
      const match = getBlockNode(editor.raw);
      if (!match) return null;
      const { anchor } = sel;
      const { path } = match;
      const start = Editor.start(editor.raw, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor.raw, range);
      const param = SHORTCUTS[beforeText.trim()];
      if (!param) return null;
      Transforms.select(editor.raw, range);
      Transforms.delete(editor.raw);
      const [key, data] = param.split(".");
      editor.command.exec(key, { extraKey: data, path });
      event.preventDefault();
    }
    if (!sel.isCollapsed) {
      for (const [key, value] of Object.entries(COMMAND_SHORTCUTS)) {
        const [code, ...keys] = key.split("-");
        if (code === String(event.keyCode)) {
          if (keys.every(k => event[k as "ctrlKey"])) {
            event.preventDefault();
            editor.command.exec(value, {
              marks: Editor.marks(editor.raw) as TextElement,
            });
          }
          break;
        }
      }
    }
  }
}
