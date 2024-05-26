import { BlockPlugin } from "doc-editor-core";
import type { Editor } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { isCollapsed, isMatchedEvent } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";
import type { KeyboardEvent } from "react";

import { INDENT_KEY } from "./types";

export class IndentPlugin extends BlockPlugin {
  public key: string = INDENT_KEY;
  public priority: number = -1;

  constructor(private editor: Editor) {
    super();
  }

  public destroy(): void {}

  public match(): boolean {
    return false;
  }

  public onKeyDown(event: KeyboardEvent<HTMLDivElement>): boolean | void {
    if (isMatchedEvent(event, KEYBOARD.TAB) && isCollapsed(this.editor, this.editor.selection)) {
      Transforms.insertText(this.editor, "\t");
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
