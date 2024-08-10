import { Editor, HistoryEditor } from "doc-editor-delta";

import type { EditorKit } from "../editor/";
import type { EditorRaw } from "../editor/types";
import { EDITOR_EVENT } from "../event/bus/action";
import type { ContentChangeEvent, ContentOperation } from "../event/types/bus";

export class Track {
  private raw: EditorRaw;
  private isBatching: boolean;
  private batchFlat: ContentOperation[];
  constructor(private editor: EditorKit) {
    this.raw = editor.raw;
    this.batchFlat = [];
    this.isBatching = false;
    if (this.editor.options.history) {
      this.editor.event.on(EDITOR_EVENT.CONTENT_CHANGE, this.onApply);
    }
  }

  public destroy() {
    this.batchFlat = [];
    this.editor.event.off(EDITOR_EVENT.CONTENT_CHANGE, this.onApply);
  }

  private onApply(e: ContentChangeEvent) {
    if (this.isBatching) {
      this.batchFlat.push(e.change);
    }
  }

  public startup() {
    this.isBatching = true;
  }

  public shutdown() {
    this.isBatching = false;
    if (this.batchFlat.length === 0) {
      return void 0;
    }
    this.raw.history.undos.push([...this.batchFlat]);
    this.batchFlat = [];
  }

  public batch(fn: () => void) {
    if (!this.editor.options.history) return void 0;
    // NOTE: 暂时无嵌套的场景 在有需要时实现`Batch Op Stack`
    // Batch Start
    //   Batch Start
    //   Batch End
    // Batch End
    this.isBatching = true;
    Editor.withoutNormalizing(this.raw, () => {
      HistoryEditor.withoutSaving(this.raw, fn);
    });
    this.isBatching = false;
    if (this.batchFlat.length === 0) {
      return void 0;
    }
    this.raw.history.undos.push([...this.batchFlat]);
    this.batchFlat = [];
  }

  public undo() {
    if (!this.editor.options.history) return void 0;
    this.raw.undo();
  }

  public redo() {
    if (!this.editor.options.history) return void 0;
    this.raw.redo();
  }

  public canUndo() {
    return this.raw.history.undos.length > 0;
  }

  public canRedo() {
    return this.raw.history.redos.length > 0;
  }

  public clear() {
    this.raw.history.undos.length = 0;
    this.raw.history.redos.length = 0;
  }
}
