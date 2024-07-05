import type { EditorKit } from "../editor";
import type { EditorRaw } from "../editor/types";
import { EDITOR_EVENT } from "../event/bus/action";

export class Clipboard {
  private raw: EditorRaw;

  constructor(private editor: EditorKit) {
    this.raw = editor.raw;
    editor.event.on(EDITOR_EVENT.COPY, this.onCopy);
    editor.event.on(EDITOR_EVENT.CUT, this.onCut);
    editor.event.on(EDITOR_EVENT.PASTE, this.onPaste);
  }

  destroy() {
    this.editor.event.off(EDITOR_EVENT.COPY, this.onCopy);
    this.editor.event.off(EDITOR_EVENT.CUT, this.onCut);
    this.editor.event.off(EDITOR_EVENT.PASTE, this.onPaste);
  }

  public onCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {};

  public onCut = (event: React.ClipboardEvent<HTMLDivElement>) => {};

  public onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {};
}
