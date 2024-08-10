import type { BaseRange, Location } from "doc-editor-delta";
import { Range, ReactEditor, Transforms } from "doc-editor-delta";

import type { EditorKit } from "../editor";
import type { EditorRaw } from "../editor/types";

export class Selection {
  private raw: EditorRaw;
  constructor(private editor: EditorKit) {
    this.raw = this.editor.raw;
  }

  public get() {
    const selection = this.raw.selection;
    if (!selection) return null;
    const prototype = {
      isCollapsed: () => Range.isCollapsed(selection),
      isBackward: () => Range.isBackward(selection),
    };
    const sel: BaseRange & typeof prototype = Object.create(prototype);
    sel.anchor = selection.anchor;
    sel.focus = selection.focus;
    return sel;
  }

  public set(range: Location | null) {
    if (!range) {
      // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/transforms/selection.ts#L60
      if (this.raw.selection) {
        this.raw.apply({
          type: "set_selection",
          properties: this.raw.selection,
          newProperties: null,
        });
      }
    } else {
      Transforms.select(this.raw, range);
    }
  }

  public getFocusPath() {
    const selection = this.raw.selection;
    if (!selection) return null;
    return selection.focus.path;
  }

  public focus() {
    ReactEditor.focus(this.raw);
  }

  public isFocused() {
    return ReactEditor.isFocused(this.raw);
  }
}
