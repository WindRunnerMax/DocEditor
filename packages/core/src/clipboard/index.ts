import type { BaseNode } from "doc-editor-delta";

import type { EditorKit } from "../editor";
import { EDITOR_EVENT } from "../event/bus/action";
import { Copy } from "./modules/copy";
import { Paste } from "./modules/paste";

export class Clipboard {
  private copyModule: Copy;
  private pasteModule: Paste;

  constructor(private editor: EditorKit) {
    this.copyModule = new Copy(editor);
    this.pasteModule = new Paste(editor);
    editor.event.on(EDITOR_EVENT.COPY, this.copyModule.onCopy);
    editor.event.on(EDITOR_EVENT.CUT, this.copyModule.onCut);
    editor.event.on(EDITOR_EVENT.PASTE, this.pasteModule.onPaste);
  }

  destroy() {
    this.editor.event.off(EDITOR_EVENT.COPY, this.copyModule.onCopy);
    this.editor.event.off(EDITOR_EVENT.CUT, this.copyModule.onCut);
    this.editor.event.off(EDITOR_EVENT.PASTE, this.pasteModule.onPaste);
  }

  public copyNode(nodes: BaseNode[]) {
    this.copyModule.copy(nodes);
  }
}
