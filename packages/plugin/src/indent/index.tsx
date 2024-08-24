import type { EditorKit } from "doc-editor-core";
import { BlockPlugin, EDITOR_EVENT } from "doc-editor-core";
import { Transforms } from "doc-editor-delta";
import { DEFAULT_PRIORITY, isCollapsed, isMatchedEvent } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";
import type { KeyboardEvent } from "react";

import { INDENT_KEY } from "./types";

export class IndentPlugin extends BlockPlugin {
  public key: string = INDENT_KEY;
  public priority: number = DEFAULT_PRIORITY - 1;

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
    if (
      isMatchedEvent(event, KEYBOARD.TAB) &&
      isCollapsed(this.editor.raw, this.editor.raw.selection)
    ) {
      Transforms.insertText(this.editor.raw, "\t");
      event.preventDefault();
      event.stopPropagation();
    }
  };
}
