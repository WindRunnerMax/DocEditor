import type { Editor } from "doc-editor-delta";
import { isBlock } from "doc-editor-utils";

import type { EditorSuite } from "../editor/types";
import { NormalizeRules } from "./rules";
import type { EditorSchema } from "./types";

export class Schema extends NormalizeRules {
  public readonly editor: Editor;
  public readonly raw: EditorSchema;

  constructor(schema: EditorSchema, editor: Editor) {
    super();
    this.raw = schema;
    this.editor = editor;
    for (const [key, value] of Object.entries(schema)) {
      if (value.void) {
        this.void.add(key);
        this.block.add(key);
      }
      if (value.block) {
        this.block.add(key);
      }
      if (value.wrap) {
        this.block.add(value.wrap);
        this.wrap.set(value.wrap, key);
        this.pair.set(key, value.wrap);
      }
      if (value.inline) {
        this.inline.add(key);
      }
      if (value.instance) {
        this.instance.add(key);
      }
    }
  }

  public with(editor: Editor): EditorSuite {
    const { isVoid, normalizeNode, isInline } = editor;

    editor.isInline = element => {
      for (const key of Object.keys(element)) {
        if (this.inline.has(key)) return true;
      }
      return isInline(element);
    };

    editor.isVoid = element => {
      for (const key of Object.keys(element)) {
        if (this.void.has(key)) return true;
      }
      return isVoid(element);
    };

    editor.normalizeNode = entry => {
      const [node] = entry;
      if (!isBlock(editor, node)) {
        normalizeNode(entry);
        return void 0;
      }
      this.normalize(editor, entry);
      normalizeNode(entry);
    };

    return editor as EditorSuite;
  }
}
