import type { Location } from "doc-editor-delta";
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
    const sel = {
      anchor: selection.anchor,
      focus: selection.focus,
      isCollapsed: Range.isCollapsed(selection),
      isBackward: Range.isBackward(selection),
    };
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

  public move(distance: number) {
    Transforms.move(this.raw, { unit: "character", distance });
  }
}
