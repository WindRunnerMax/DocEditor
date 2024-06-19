import { HistoryEditor } from "doc-editor-delta";

import type { EditorSuite } from "../editor/types";
import { EDITOR_EVENT } from "../event/bus/action";
import type { ContentChangeEvent, ContentOperation } from "../event/types/bus";

export class Track {
  private isBatching: boolean;
  private batchFlat: ContentOperation[];
  constructor(private editor: EditorSuite) {
    this.batchFlat = [];
    this.isBatching = false;
    this.editor.event.on(EDITOR_EVENT.CONTENT_CHANGE, this.onApply);
  }

  public destroy = () => {
    this.batchFlat = [];
    this.editor.event.off(EDITOR_EVENT.CONTENT_CHANGE, this.onApply);
  };

  private onApply = (e: ContentChangeEvent) => {
    if (this.isBatching) {
      this.batchFlat.push(e.change);
    }
  };

  public batch = (fn: () => void) => {
    // NOTE: 暂时无嵌套的场景 在有需要时实现`Batch Op Stack`
    // Batch Start
    //   Batch Start
    //   Batch End
    // Batch End
    this.isBatching = true;
    HistoryEditor.withoutSaving(this.editor, fn);
    this.isBatching = false;
    this.editor.history.undos.push([...this.batchFlat]);
    this.batchFlat = [];
  };
}
